const Faq = require("../Model/faq_model");

exports.createFaq = async (FaqData) => {
  const newFaq = new Faq(FaqData);
  return await newFaq.save();
};

exports.deleteFaq = async (id) => {
  return await Faq.findByIdAndDelete(id);
};

exports.getFaq = async () => {
  return await Faq.find();
};
