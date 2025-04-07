const CourseService = require("../Service/course_service");

exports.createCourse = async (req, res) => {
  const { user, fname, lname, email, phone, content, type, mainTopic } = req.body;
  try {
    const newCourse = await CourseService.createCourse({ user, fname, lname, email, phone, content, type, mainTopic });
    await CourseService.sendCourseMail(req.body.email, req.body.fname, req.body.lname, req.body.mainTopic);
    res.status(200).json({ success: true, message: "Course created successfully", courseId: newCourse._id });
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
    res.status(500).json({ success: false, message: "Internal server error" });
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
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: "Course deleted successfully", deleteCourse: deletedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};