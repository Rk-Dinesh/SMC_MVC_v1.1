const Tax = require("../Model/tax_model");

exports.createTax = async (taxData) => {
    const newTax = new Tax(taxData);
    return await newTax.save();
};

exports.updateTax = async (id, taxData) => {
    return await Tax.findByIdAndUpdate(id, taxData, { new: true, runValidators: true });
};

exports.deleteTax = async (id) => {
    return await Tax.findByIdAndDelete(id);
};

exports.getAllTaxes = async () => {
    return await Tax.find();
};
