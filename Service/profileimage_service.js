const ProfileImage = require("../Model/profile_image");

exports.uploadOrUpdateImage = async (imageData) => {
  const { name, user, image } = imageData;
  const existingImage = await ProfileImage.findOne({ user });
  if (existingImage) {
    return await ProfileImage.findOneAndUpdate({ user }, { name, image }, { new: true });
  }
  const newImage = new ProfileImage({ name, user, image });
  return await newImage.save();
};

exports.getImageByUserId = async (user) => {
  return await ProfileImage.findOne({ user });
};