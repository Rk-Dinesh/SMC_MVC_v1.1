const FaqService = require("../Service/faq_service");

exports.createFaq = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newFaq = await FaqService.createFaq({ title, content });
    res.status(200).json({
      success: true,
      message: "New FAQ created successfully",
      Faq: newFaq,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFaq = await FaqService.deleteFaq(id);

    if (!deletedFaq) {
      return res.status(404).json({ success: false, message: "Faq not found" });
    }

    res.status(200).json({
      success: true,
      message: "Faq deleted successfully",
      Faq: deletedFaq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getFaq = async (req, res) => {
  try {
    const faq = await FaqService.getFaq();
    res.status(200).json({ success: true, faq: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
