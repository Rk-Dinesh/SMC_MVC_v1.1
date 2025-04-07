require("dotenv").config();
const crypto = require("crypto");
const User = require("../Model/user_model");
const Course = require("../Model/course_model");
const Help = require("../Model/ticketsupport_model");
const Ticket = require("../Model/ticket_model");
const SubscriptionPlan = require("../Model/subscriptionplan_model");
const Notify = require("../Model/notification_model");
const ProfileImage = require("../Model/profile_image");
const Count = require("../Model/plancount_model");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const transporter = require("./transporter_service");

exports.createUser = async (userData) => {
  const { email, fname, lname, phone, dob, type } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const token = crypto.randomBytes(20).toString("hex");

  const newUser = new User({
    email,
    fname,
    lname,
    phone,
    dob,
    type,
    verifyToken: token,
    verifyTokenExpires: Date.now() + 3600000, // Token expires in 1 hour
  });

  await newUser.save();

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to Seek My Course!",
    html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <html lang="en">
                
                  <head></head>
                 <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Welcome to <strong>PickMyCourse !</strong>, We're excited to have you join our community of learners.<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
                 </div>
                
                  <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
                    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
                      <tr style="width:100%">
                        <td>
                          <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Welcome to <strong>PickMyCourse</strong></h1>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hi <strong>${fname}</strong>,</p>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Welcome to <strong>PickMyCourse !</strong>, We're excited to have you join our community of learners.</p>
                          <p style="margin-left:0px;margin-right:0px;margin-top:5px;margin-bottom:5px;padding:0px;font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Get started by creating your first AI-powered course:</p>
                           <p style="margin-left:0px;margin-right:0px;margin-top:5px;margin-bottom:5px;padding:0px;font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Here are some helpful resources to guide you:</p>
                            <p style="margin-left:0px;margin-right:0px;margin-top:5px;margin-bottom:5px;padding:0px;font-size:14px;line-height:24px;margin:16px 0;color:rgb(78, 166, 226)"><a href="https://helpcenter.pickmycourseai.support/" target="_blank" >https://helpcenter.pickmycourseai.support/</a></p>
                          
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Happy learning!,<p target="_blank" style="color:rgb(0,0,0);text-decoration:none;text-decoration-line:none">The <strong>Seek My Course</strong> Team</p></p>
                          </td>
                      </tr>
                    </table>
                  </body>
                
                </html>
        `,
  };

  await transporter.sendMail(mailOptions);

  return newUser;
};

exports.signInUser = async (phone) => {
  const user = await User.findOne({ phone });
  if (!user) {
    throw new Error("Invalid phone");
  }
  return user;
};

exports.verifyEmail = async (token) => {
  const user = await User.findOne({
    verifyToken: token,
    verifyTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  user.verifyToken = null;
  user.verifyTokenExpires = null;
  user.verified = true;
  await user.save();

  return user;
};

exports.getAllUsers = async () => {
  return await User.find();
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

exports.deleteUser = async (id) => {
  await Promise.all([
    Course.deleteMany({ user: id }),
    Help.deleteMany({ user: id }),
    Ticket.deleteMany({ user: id }),
    SubscriptionPlan.deleteMany({ user: id }),
    Notify.deleteMany({ user: id }),
    ProfileImage.deleteOne({ user: id }),
    Count.deleteOne({ user: id }),
  ]);

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new Error("User not found");
  }

  return { message: "User and associated data deleted successfully" };
};

exports.updateEmail = async (phone, newEmail) => {
  const user = await User.findOne({ phone });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const verify = await User.findOne({ email: newEmail });
  if (verify) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  user.email = newEmail;
  await user.save();

  const updatedTickets = await Ticket.updateMany(
    { phone },
    { $set: { email: newEmail } }
  );
  const updatedCourses = await Course.updateMany(
    { phone },
    { $set: { email: newEmail } }
  );

  return {
    updatedTicketsCount: updatedTickets.modifiedCount,
    updatedCoursesCount: updatedCourses.modifiedCount,
  };
};

exports.updatePhone = async (email, newPhone) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const verify = await User.findOne({ phone: newPhone });
  if (verify) {
    throw new Error("PHONE_ALREADY_EXISTS");
  }

  user.phone = newPhone;
  await user.save();

  const updatedTickets = await Ticket.updateMany(
    { email },
    { $set: { phone: newPhone } }
  );
  const updatedCourses = await Course.updateMany(
    { email },
    { $set: { phone: newPhone } }
  );

  return {
    updatedTicketsCount: updatedTickets.modifiedCount,
    updatedCoursesCount: updatedCourses.modifiedCount,
  };
};

exports.uploadCSV = async (filePath) => {
  const csvData = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => csvData.push(row))
      .on("end", async () => {
        try {
          const result = await User.insertMany(csvData);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          fs.unlinkSync(filePath);
        }
      })
      .on("error", (error) => reject(error));
  });
};
