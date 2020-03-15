const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Admin = require("../../models/Admin");
const Pullbox = require("../../models/Pullbox");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

///////POST api/users
///////REGISTER USER/
///////PUBLIC////////
router.post(
  "/",
  [check("email", "Email is required").isEmail()],
  [check("adminkey", "Admin Key is required").isLength({ min: 8 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, adminkey } = req.body;

    try {
      let admin = await Admin.findOne({ email });

      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Admin already exists" }] });
      }

      admin = new Admin({
        email,
        adminkey
      });

      //PASSWORD ENCRYPTION//
      const salt = await bcrypt.genSalt(10);

      admin.adminkey = await bcrypt.hash(adminkey, salt);

      await admin.save();

      const payload = {
        admin: {
          id: admin.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

router.post("/pullboxes/:id/:comic_id", auth, async (req, res) => {
  const {
    title,
    available,
    fullSubscription,
    from,
    to,
    currentIssue
  } = req.body;

  const updatedComic = {};
  updatedComic.comics = {};
  // updatedComic.comics.id = req.params.comic_id;
  if (title) updatedComic.comics.title = title;
  if (available) updatedComic.comics.available = available;
  if (fullSubscription) updatedComic.comics.fullSubscription = fullSubscription;
  if (from) updatedComic.comics.from = from;
  if (to) updatedComic.comics.to = to;
  if (currentIssue) updatedComic.comics.currentIssue = currentIssue;

  try {
    let pullbox = await Pullbox.findOne({ _id: req.params.id });

    if (pullbox) {
      pullbox = await Pullbox.findOneAndUpdate(
        { "comics._id": req.params.comic_id },
        { $set: updatedComic },
        { new: true }
      );
      // console.log(updatedComic);
      return res.json(pullbox);
    } else {
      return res.json({ msg: "Cannot find pullbox" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
