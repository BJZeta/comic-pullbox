const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Pullbox = require("../../models/Pullbox");
const { check, validationResult } = require("express-validator");

///////GET api/profile/me ////////
///////GET CURRENT USER'S PROFILE/
///////PRIVATE////////////////////
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no Profile" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

///////POST api/profile ////
///////CREATE/UPDATE PROFILE
///////PRIVATE//////////////
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bio, favComics } = req.body;

  /////BUILD PROFILE OBJECT
  const profileFields = {};
  profileFields.user = req.user.id;
  if (bio) profileFields.bio = bio;
  if (favComics) {
    profileFields.favComics = favComics
      .split(",")
      .map(favComic => favComic.trim());
  }
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id).select("-password");
    /////TO UPDATE PROFILE
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    /////TO CREATE PROFILE
    profile = new Profile(profileFields);

    await profile.save();
    res.json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

///////GET api/profile /
///////GET ALL PROFILES/
///////PRIVATE//////////
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

///////GET api/profile/user/:user_id /
///////GET PROFILE BY USER ID/////////
///////PRIVATE////////////////////////
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

///////POST api/profile/pullbox /
///////ADD A COMIC TO PULLBOX////
///////PRIVATE///////////////////
router.post(
  "/pullbox",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("from", "What issue are you starting from?")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      available,
      fullSubscription,
      from,
      to,
      currentIssue
    } = req.body;

    const newComic = {
      title,
      available,
      fullSubscription,
      from,
      to,
      currentIssue
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.comics.unshift(newComic);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

///////DELETE api/profile/pullbox/:comic_id
///////DELETE COMIC FROM PULLBOX///////////
///////PRIVATE/////////////////////////////
router.delete("/pullbox/:comic_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //GET REMOVE INDEX//
    const removeIndex = profile.comics
      .map(comic => comic.id)
      .indexOf(req.params.comic_id);

    profile.comics.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

///////DELETE api/profile /////////////
///////DELETE PROFILE USER AND PULLBOX/
///////PRIVATE/////////////////////////
router.delete("/", auth, async (req, res) => {
  try {
    //REMOVE PULLBOX
    await Profile.findOneAndRemove({ user: req.user.id });
    //REMOVE PULLBOX
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
