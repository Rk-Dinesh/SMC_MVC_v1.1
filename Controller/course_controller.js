const User = require("../Model/user_model");
const CourseService = require("../Service/course_service");

exports.createCourse = async (req, res) => {
  const { user, content, type, mainTopic,lang } = req.body; 
 const userDetails = await User.findOne({ _id: user })
  if (!userDetails) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const { fname, lname, email, phone } = userDetails;

  try {
    const newCourse = await CourseService.createCourse({ user, fname, lname, email, phone, content, type, mainTopic,lang });
    await CourseService.sendCourseMail(fname,lname,email,phone, req.body.mainTopic);
    res.status(200).json({ success: true, message: "Course created successfully", courseId: newCourse._id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.sharedCourse = async (req, res) => {
  const { user, content, type, mainTopic,lang } = req.body;
 const userDetails = await User.findOne({ _id: user })
  if (!userDetails) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const { fname, lname, email, phone } = userDetails;

  try {
    const newCourse = await CourseService.createCourse({ user, fname, lname, email, phone, content, type, mainTopic,lang });
    await CourseService.sendCourseMail(fname,lname,email,phone, req.body.mainTopic);
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