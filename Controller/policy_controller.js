const PolicyService = require("../Service/policy_service");

exports.updatePolicy = async (req, res) => {
    const { terms, privacy, cancel, refund, billing } = req.body;
    
  try {
    const updatedPolicy = await PolicyService.updatePolicy({terms, privacy, cancel, refund, billing});
    res.json({ success: true, message: "Policy updated successfully", data: updatedPolicy });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getPolicy = async (req, res) => {
  try {
    const policy = await PolicyService.getPolicy();
    res.json(policy ? { success: true, data: policy } : { success: false, message: "No policies found" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    await PolicyService.deletePolicy();
    res.json({ success: true, message: "Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};