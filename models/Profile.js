const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  favComics: {
    type: [String],
    required: true
  },
  pullbox: [
    {
      comic: {
        type: String,
        available: {
          type: String,
          default: "Pending"
        },
        numOfIssue: {
          type: String,
          default: "Entire Series"
        }
      }
    }
  ]
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
