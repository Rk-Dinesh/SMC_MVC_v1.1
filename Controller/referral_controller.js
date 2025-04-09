// controllers/referralController.js
const ReferralService = require("../Service/referral_service");

exports.createReferral = async (req, res, next) => {
  try {
    const { referrerName } = req.body;
    const referralLink = await ReferralService.createReferralLink(referrerName);
    res
      .status(200)
      .json({ message: "Referral link created successfully!", referralLink });
  } catch (error) {
    next(error); // Pass error to the error handler
  }
};

exports.getReferralDetails = async (req, res, next) => {
  try {
    const { referralCode } = req.query;

    if (!referralCode) {
      return res.status(400).json({ error: "Referral code is required." });
    }
    const referralDetails = await ReferralService.getReferralDetails(
      referralCode
    );
    res.status(200).json({
      success: true,
      message: "Referral details fetched successfully.",
      data: referralDetails,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReferralAllDetails = async (req, res, next) => {
  try {
    const referralDetails = await ReferralService.getReferralAllDetails();
    res.status(200).json({
      success: true,
      message: "Referral details fetched successfully.",
      data: referralDetails,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReferral = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteReferrals = await ReferralService.deleteReferral(id);
    if (!deleteReferrals) {
      return res
        .status(404)
        .json({ success: false, message: "Referral not found." });
    }
    res.status(200).json({ success: true, message: "Referral deleted." });
  } catch (error) {
    next(error);
  }
};
