const {
  SubCategory1,
  SubCategory2,
  CategoryCourse,
} = require("../Model/categoryCourses_model");
const path = require("path");
const CategoryCourseService = require("../Service/categoryCourse_service");
const { default: mongoose } = require("mongoose");

exports.createCategoryCourse = async (req, res) => {
  try {
    const { category, subCategory1, subCategory2 } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const newCategory = await CategoryCourse.create({ name: category });

    const subCategories1 = await Promise.all(
      (subCategory1 || []).map(async (subCat) => {
        return await SubCategory1.create({
          name: subCat,
          category: newCategory._id,
        });
      })
    );

    const subCategories2 = await Promise.all(
      (subCategory2 || []).map(async (subCat) => {
        const subCat1 = subCat.subCategory1;
        const subCat1Doc = await SubCategory1.findOne({
          name: subCat1,
          category: newCategory._id,
        });

        if (subCat1Doc) {
          return await Promise.all(
            (subCat.subCategories || []).map(async (subCat2) => {
              return await SubCategory2.create({
                name: subCat2,
                subCategory1: subCat1Doc._id,
              });
            })
          );
        }
      })
    );

    res.status(201).json({
      success: true,
      message: "Category and subcategories created successfully",
      category: newCategory,
      subCategories1,
      subCategories2,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the category",
      error: error.message,
    });
  }
};

exports.uploadCategories = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = path.join(__dirname, "../excel", req.file.filename);

    const structuredData =
      await CategoryCourseService.parseCSVAndBuildCategories(filePath);

    return res.status(200).json({
      success: true,
      message: "CSV successfully processed",
      data: structuredData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoryCourse.find().lean();

    const result = [];

    for (const category of categories) {
      const subCategory1List = await SubCategory1.find({
        category: category._id,
      }).lean();

      const populatedSubCategory1 = [];

      for (const sc1 of subCategory1List) {
        const subCategory2List = await SubCategory2.find({
          subCategory1: sc1._id,
        }).lean();

        populatedSubCategory1.push({
          ...sc1,
          subCategories: subCategory2List,
        });
      }

      result.push({
        ...category,
        subCategory1: populatedSubCategory1,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoriesAsTable = async (req, res, next) => {
  try {
    const categories = await CategoryCourse.find().lean();

    const tableData = [];

    for (const category of categories) {
      const subCategory1List = await SubCategory1.find({
        category: category._id,
      }).lean();

      for (const sc1 of subCategory1List) {
        const subCategory2List = await SubCategory2.find({
          subCategory1: sc1._id,
        }).lean();

        if (subCategory2List.length === 0) {
          // Push one row even if no subCategory2 exists
          tableData.push({
            categoryId: category._id,
            category: category.name,
            subCategory1Id: sc1._id,
            subCategory1: sc1.name,
            subCategory2Id: null,
            subCategory2: "",
          });
        } else {
          for (const sc2 of subCategory2List) {
            tableData.push({
              categoryId: category._id,
              category: category.name,
              subCategory1Id: sc1._id,
              subCategory1: sc1.name,
              subCategory2Id: sc2._id,
              subCategory2: sc2.name,
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: tableData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoriesAsTablePageLimit = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category: filterCategory = "",
      subCategory1: filterSubCategory1 = "",
      subCategory2: filterSubCategory2 = "",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const categories = await CategoryCourse.find().lean();

    const tableData = [];

    for (const category of categories) {
      // Apply category filter
      if (filterCategory && category.name.toLowerCase() !== filterCategory.toLowerCase()) continue;

      const subCategory1List = await SubCategory1.find({ category: category._id }).lean();

      for (const sc1 of subCategory1List) {
        // Apply subCategory1 filter
        if (filterSubCategory1 && sc1.name.toLowerCase() !== filterSubCategory1.toLowerCase()) continue;

        const subCategory2List = await SubCategory2.find({ subCategory1: sc1._id }).lean();

        for (const sc2 of subCategory2List) {
          // Apply subCategory2 filter
          if (filterSubCategory2 && sc2.name.toLowerCase() !== filterSubCategory2.toLowerCase()) continue;

          // Apply search filter (across all fields)
          const matchesSearch =
            !search ||
            category.name.toLowerCase().includes(search.toLowerCase()) ||
            sc1.name.toLowerCase().includes(search.toLowerCase()) ||
            sc2.name.toLowerCase().includes(search.toLowerCase());

          if (!matchesSearch) continue;

          tableData.push({
            category: category.name,
            subCategory1: sc1.name,
            subCategory2: sc2.name,
          });
        }

        // If no subCategory2 but still need to show row (if filters match)
        if (subCategory2List.length === 0) {
          const matchesSearch =
            !search ||
            category.name.toLowerCase().includes(search.toLowerCase()) ||
            sc1.name.toLowerCase().includes(search.toLowerCase());

          if (!matchesSearch) continue;

          tableData.push({
            category: category.name,
            subCategory1: sc1.name,
            subCategory2: "",
          });
        }
      }
    }

    // Paginate data manually
    const total = tableData.length;
    const paginatedData = tableData.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      data: paginatedData,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getOnlyCategory = async (req, res, next) => {
    try {
        const categories = await CategoryCourse.find().lean();
        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching categories",
            error: error.message,
        });
    }
}


exports.getBasedOnCategory = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const categoryId = new mongoose.Types.ObjectId(category);

    const categories = await SubCategory1.find({ category: categoryId }).lean();

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subcategories found for this category",
      });
    }

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
exports.getBasedOnSubCategory1 = async (req, res, next) => {
  try {
    const { subCategory1 } = req.query;

    if (!subCategory1) {
      return res.status(400).json({
        success: false,
        message: "SubCategory1 is required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(subCategory1)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subCategory1 ID",
      });
    }

    const subCategory1Id = new mongoose.Types.ObjectId(subCategory1);

    const subCategories = await SubCategory2.find({ subCategory1: subCategory1Id }).lean();

    if (subCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subcategories found for this SubCategory1",
      });
    }

    res.status(200).json({
      success: true,
      data: subCategories,
    });
  } catch (error) {
    next(error);
  }
}