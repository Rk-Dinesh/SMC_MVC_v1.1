const CategoryService = require('../Service/category_service')

exports.createCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        const newCategory = await CategoryService.createCategory({ category });

        res.status(200).json({
            success: true,
            message: "Category created successfully",
            Category: newCategory,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { category } = req.body;

        const updatedCategory = await CategoryService.updateCategory(id, { category });

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            Category: updatedCategory,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCategory = await CategoryService.deleteCategory(id);

        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            Category: deletedCategory,
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await CategoryService.getCategories();
        res.status(200).json({ success: true, cate: categories });
    } catch (error) {
        next(error);
    }
};