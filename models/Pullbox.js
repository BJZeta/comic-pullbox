const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PullboxSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    type: String,
    required: true
  },
  comics: [
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

module.exports = Pullbox = mongoose.model("pullbox", PullboxSchema);
