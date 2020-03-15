const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Pullbox = require("../../models/Pullbox");
const { check, validationResult } = require("express-validator");

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

    const newPullbox = new Pullbox({
      user: req.user.id,
      name: user.name,
      comics: []
    });

    await profile.save();
    const pullbox = await newPullbox.save();
    res.json({ profile, pullbox });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
