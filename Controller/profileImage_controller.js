const ProfileImageService = require("../Service/profileimage_service");

exports.uploadOrUpdateImage = async (req, res) => {
  const { name, user, image } = req.body;
  try {
    const images = await ProfileImageService.uploadOrUpdateImage({ name, user, image });
    res.status(200).json({ success: true, message: "Image uploaded/updated successfully", images });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getImageByUserId = async (req, res) => {
  try {
    const image = await ProfileImageService.getImageByUserId(req.query.user);
    res.status(200).json({ success: true, user:image });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};