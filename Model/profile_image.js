const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: String,
  user: String,
  image: String,
});

const ProfileImage = mongoose.model("ProfileImage", ImageSchema);
module.exports = ProfileImage;
