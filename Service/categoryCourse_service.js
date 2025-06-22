const CategoryCourse = require("../Model/categoryCourses_model");

exports.createCategoryCourse = async (categoryData) => {
    const newCategory = new CategoryCourse(categoryData);
    return await newCategory.save();
};

exports.updateCategoryCourse = async (id, categoryData) => {
    return await CategoryCourse.findByIdAndUpdate(id, categoryData, {
        new: true,
        runValidators: true,
    });
};

exports.addSubCategories = async (categoryId, subCategory1Items = [], subCategory2Items = []) => {
    const category = await CategoryCourse.findById(categoryId);
    if (!category) {
        throw new Error("Category not found");
    }
    subCategory1Items.forEach(item => {
        if (!category.subCategory1.includes(item)) {
            category.subCategory1.push(item);
        }
    });
    subCategory2Items.forEach(item => {
        if (!category.subCategory2.includes(item)) {
            category.subCategory2.push(item);
        }
    });
    return await category.save();
};

exports.deleteCategoryCourse = async (id) => {
    return await CategoryCourse.findByIdAndDelete(id);
};

exports.getCategoriesCourse = async () => {
    return await CategoryCourse.find();
};