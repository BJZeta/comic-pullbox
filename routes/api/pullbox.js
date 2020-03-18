const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Pullbox = require("../../models/Pullbox");
const User = require("../../models/User");

///////POST api/pullbox //////
///////ADD A COMIC TO PULLBOX/
///////PRIVATE////////////////
router.post(
  "/",
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
      const pullbox = await Pullbox.findOne({ user: req.user.id });

      pullbox.comics.unshift(newComic);

      await pullbox.save();

      res.json(pullbox);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

///////DELETE api/pullbox/:comic_id
///////DELETE COMIC FROM PULLBOX///////////
///////PRIVATE/////////////////////////////
router.delete("/:comic_id", auth, async (req, res) => {
  try {
    const pullbox = await Pullbox.findOne({ user: req.user.id });

    //GET REMOVE INDEX//
    const removeIndex = pullbox.comics
      .map(comic => comic.id)
      .indexOf(req.params.comic_id);

    pullbox.comics.splice(removeIndex, 1);

    await pullbox.save();

    res.json(pullbox);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
