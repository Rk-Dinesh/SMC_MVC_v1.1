const preGenerateCourse = require('../Service/pre_genCourse_Service');

exports.precreateCourse = async (req, res) => {
  const {  content, type, mainTopic, lang,category,subCategory1,subCategory2 } = req.body;
  try {
    const newCourse = await preGenerateCourse.precreateCourse({
      content,
      type,
      mainTopic,
      lang,category,subCategory1,subCategory2
    });
    
    res.status(200).json({
      success: true,
      message: "PreCourse created successfully",
      courseId: newCourse._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
    
  }
};

exports.addUserToCourse = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    console.log("Adding user to course:", courseId, userId);
    
    
    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Both courseId and userId are required'
      });
    }
    const updatedCourse = await preGenerateCourse.addUserToPreCourse(courseId, userId);

    res.json({ success: true,data: updatedCourse, message: "Pre-Course updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updatePreCourse = async (req, res) => {
  try {
    await preGenerateCourse.updatePreCourse(req.body.courseId, req.body.content);
    res.json({ success: true, message: "Pre-Course updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.finishPreCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const userId = req.body.user; 
    await exports.finishPreCourse(courseId, userId);
    res.json({ success: true, message: "Pre-Course completed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllPreCourses = async (req, res) => {
  try {
    const courses = await preGenerateCourse.getAllPreCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.deletePreCourse = async (req, res) => {
  try {
    const deletedCourse = await preGenerateCourse.deletePreCourse(req.params.id);
    if (!deletedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Pre-Course not found" });
    }
    res.status(200).json({
      success: true,
      message: "Pre-Course deleted successfully",
      deleteCourse: deletedCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAllPreCourseLimit = async (req, res, next) => {
  try {
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
      const searchValue = req.query.search || ""; // Default to empty string if not provided
      const category = req.query.category || "";
      const subcategory1 = req.query.subCategory1 || "";
      const subcategory2 = req.query.subCategory2 || "";


      // Fetch data from the service
      const { course, totalCount } = await preGenerateCourse.getAllPreCourseLimit(page, limit, searchValue,category,subcategory1,subcategory2);
      // Send the response
      res.status(200).json({
          status: true,
          message: "PreCourse retrieved successfully",
          data: course,
          metadata: {
              currentPage: page,
              totalPages: Math.ceil(totalCount / limit),
              totalItems: totalCount,
          },
      });
  } catch (error) {
      next(error);
  }
};

exports.getCourseWithUsers = async (req, res) => {
  try {
    const { courseId } = req.query;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'courseId parameter is required'
      });
    }
    const course = await preGenerateCourse.getCourseById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
     });
  }
};

exports.updateMarks = async (req, res) => {
  const { courseId, marksString,userId } = req.body;

  try {
    const success = await preGenerateCourse.updateMarks(courseId, marksString,userId);

    if (success) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
}