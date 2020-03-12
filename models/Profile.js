const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  bio: {
    type: String
  },
  favComics: {
    type: [String]
  },
  pullbox: [
    {
      title: {
        type: String,
        required: true
      },
      available: {
        type: String,
        default: "Pending"
      },
      fullSubscription: {
        type: Boolean,
        default: false
      },
      from: {
        type: String,
        required: true
      },
      to: {
        type: String
      },
      currentIssue: {
        type: String,
        default: "Pending"
      }
    }
  ]
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
