const CategoryServiceCourse = require('../Service/categoryCourse_service')

exports.createCategoryCourse = async (req, res, next) => {
    try {
        const { category, subCategory1, subCategory2 } = req.body;

        console.log(req.body);
        

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        const subCategories1 = Array.isArray(subCategory1) ? subCategory1 : [];
        const subCategories2 = Array.isArray(subCategory2) ? subCategory2 : [];

        const newCategory = await CategoryServiceCourse.createCategoryCourse({
            category,
            subCategory1: subCategories1, 
            subCategory2: subCategories2 
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: newCategory,
        });
    } catch (error) {
        next(error);
    }
};


exports.updateCategoryCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { category } = req.body;

        const updatedCategory = await CategoryServiceCourse.updateCategoryCourse(id, { category });

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

exports.addSubCategories = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { subCategory1, subCategory2 } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required",
            });
        }

        if ((!subCategory1 || subCategory1.length === 0) && 
            (!subCategory2 || subCategory2.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "At least one subcategory is required",
            });
        }

        const updatedCategory = await CategoryServiceCourse.addSubCategories(
            categoryId,
            Array.isArray(subCategory1) ? subCategory1 : [subCategory1].filter(Boolean),
            Array.isArray(subCategory2) ? subCategory2 : [subCategory2].filter(Boolean)
        );

        res.status(200).json({
            success: true,
            message: "Subcategories added successfully",
            category: updatedCategory,
        });
    } catch (error) {
        next(error);
    }
};


exports.deleteCategoryCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCategory = await CategoryServiceCourse.deleteCategoryCourse(id);

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

exports.getCategoriesCourse = async (req, res, next) => {
    try {
        const categories = await CategoryServiceCourse.getCategoriesCourse();
        res.status(200).json({ success: true, cate: categories });
    } catch (error) {
        next(error);
    }
};