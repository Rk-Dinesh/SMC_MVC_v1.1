const Category = require("../Model/category_model");

exports.createCategory = async (categoryData) => {
    const newCategory = new Category(categoryData);
    return await newCategory.save();
};

exports.updateCategory = async (id, categoryData) => {
    return await Category.findByIdAndUpdate(id, categoryData, {
        new: true,
        runValidators: true,
    });
};

exports.deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};

exports.getCategories = async () => {
    return await Category.find();
};