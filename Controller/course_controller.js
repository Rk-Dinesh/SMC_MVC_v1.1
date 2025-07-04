const User = require("../Model/user_model");
const CourseService = require("../Service/course_service");

exports.createCourse = async (req, res) => {
  const { user, content, type, mainTopic, lang } = req.body;
  const userDetails = await User.findOne({ _id: user });
  if (!userDetails) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const { fname, lname, email, phone } = userDetails;

  try {
    const newCourse = await CourseService.createCourse({
      user,
      fname,
      lname,
      email,
      phone,
      content,
      type,
      mainTopic,
      lang,
    });
    await CourseService.sendCourseMail(
      fname,
      lname,
      email,
      req.body.mainTopic
    );
    res.status(200).json({
      success: true,
      message: "Course created successfully",
      courseId: newCourse._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
    
  }
};

exports.sharedCourse = async (req, res) => {
  const { user, content, type, mainTopic, lang } = req.body;
  const userDetails = await User.findOne({ _id: user });
  if (!userDetails) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const { fname, lname, email, phone } = userDetails;

  try {
    const newCourse = await CourseService.createCourse({
      user,
      fname,
      lname,
      email,
      phone,
      content,
      type,
      mainTopic,
      lang,
    });
    await CourseService.sendCourseMail(fname, lname, email, req.body.mainTopic);
    res.status(200).json({
      success: true,
      message: "Course created successfully",
      courseId: newCourse._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    await CourseService.updateCourse(req.body.courseId, req.body.content);
    res.json({ success: true, message: "Course updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.finishCourse = async (req, res) => {
  try {
    await CourseService.finishCourse(req.body.courseId);
    res.json({ success: true, message: "Course completed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await CourseService.getCoursesByUser(req.query.userId);
    res.json(courses);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllCourseLimit = async (req, res, next) => {
  try {
    const userId = (req.query.userId);
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
      const searchValue = req.query.search || ""; // Default to empty string if not provided

      
      // Fetch data from the service
      const { course, totalCount } = await CourseService.getAllCourseLimit(userId,page, limit, searchValue);
      // Send the response
      res.status(200).json({
          status: true,
          message: "Course retrieved successfully",
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

exports.getCoursesCompleted = async (req, res) => {
  try {
    const courses = await CourseService.getCoursesByUserCompleted(req.query.userId);
    res.json(courses);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllCompletedCourseLimit = async (req, res, next) => {
  try {
    const userId = (req.query.userId);
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
      const searchValue = req.query.search || ""; // Default to empty string if not provided

      
      // Fetch data from the service
      const { course, totalCount } = await CourseService.getCoursesByUserCompletedLimit(userId,page, limit, searchValue);
      // Send the response
      res.status(200).json({
          status: true,
          message: "CompletedCourse retrieved successfully",
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

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await CourseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await CourseService.deleteCourse(req.params.id);
    if (!deletedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      deleteCourse: deletedCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
