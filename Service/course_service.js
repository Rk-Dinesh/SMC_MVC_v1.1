require('dotenv').config();
const Course = require("../Model/course_model");
const { createApi } = require("unsplash-js");
const transporter = require('./transporter_service');
const unsplash = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

exports.createCourse = async (courseData) => {
    const { mainTopic } = courseData;
    const result = await unsplash.search.getPhotos({
      query: mainTopic,
      page: 1,
      perPage: 1,
      orientation: "landscape",
    });
    courseData.photo = result.response.results[0].urls.regular;
    const newCourse = new Course(courseData);
    return await newCourse.save();
  };
  
  exports.updateCourse = async (courseId, content) => {
    return await Course.findOneAndUpdate({ _id: courseId }, { $set: { content } }, { new: true });
  };
  
  exports.finishCourse = async (courseId) => {
    return await Course.findOneAndUpdate(
      { _id: courseId },
      { $set: { completed: true, end: Date.now() } },
      { new: true }
    );
  };
  
  exports.getCoursesByUser = async (userId) => {
    return await Course.find({ user: userId });
  };

  exports.getAllCourses = async () => {
    return await Course.find({});
  };
  
  exports.deleteCourse = async (id) => {
    return await Course.findByIdAndDelete(id);
  };
  
  exports.sendCourseMail = async (email, fname, lname, mainTopic) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Seek My Course!",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                    <html lang="en">
                    
                      <head></head>
                     <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Your Seek My Course is Ready!<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
                     </div>
                    
                     <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="text-align: center;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #000000;">Your Seek My Course is Ready!</h1>
        </td>
      </tr>
      <tr>
        <td style="font-size: 16px; color: #000000; line-height: 1.2;">
          <p>Hi <strong>${fname} ${lname}</strong>,</p>
          <p>Your course <strong>"${mainTopic}"</strong> is ready to go!</p>
          <p style="font-size: 16px; color: #000000;">Start learning now and achieve your goals.</p>
          <p style="font-size: 16px; color: #000000;">Need help? Our AI tutor is always available to answer your questions.</p>
        </td>
      </tr>
      <tr>
        <td><a href="https://app.pickmycourse.ai" target="_blank" style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px"</span><span>Start Learning</span></a></td>
      </tr>                  
     <tr style="width:100%">
        <td>
            <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Happy learning!,<p target="_blank" style="color:rgb(0,0,0);text-decoration:none;text-decoration-line:none">The <strong>Seek My Course</strong> Team</p></p>
        </td>
      </tr>
    </table>
  </body>
</html>`
    };
    return await transporter.sendMail(mailOptions);
  };