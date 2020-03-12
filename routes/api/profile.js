const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
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
    /////TO UPDATE PROFILE
    if (profile) {
      profile = await Profile.findByIdAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

///////PUT api/profile/pullbox
///////ADD COMIC TO PULLBOX///
///////PRIVATE////////////////
router.put(
  "/pullbox",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("from", "From what issue?")
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

      profile.pullbox.unshift(newComic);

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
    const removeIndex = profile.pullbox
      .map(comic => comic.id)
      .indexOf(req.params.comic_id);

    profile.pullbox.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
