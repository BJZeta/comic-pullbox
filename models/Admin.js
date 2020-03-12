const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  adminkey: {
    type: String,
    required: true
  }
});

module.exports = Admin = mongoose.model("admin", AdminSchema);
