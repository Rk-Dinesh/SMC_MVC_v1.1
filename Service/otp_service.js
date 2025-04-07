require("dotenv").config();
const OTP = require("../Model/otp_model");
const User = require("../Model/user_model");
const transporter = require("./transporter_service");

exports.createOTP = async ({ email, fname, lname }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw {
      status: 409,
      message: "User with this email already exists",
      error: "EMAIL_ALREADY_EXISTS",
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const existingOTP = await OTP.findOne({ email });

  if (existingOTP) {
    existingOTP.otp = otp;
    existingOTP.createdAt = new Date();
    await existingOTP.save();
  } else {
    await new OTP({ email, otp }).save();
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to Seek My Course!",
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <html lang="en">
        
          <head></head>
         <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Welcome to <strong>PickMyCourse !</strong>, Change Email address<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
         </div>
        
          <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
            <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
              <tr style="width:100%">
                <td>
                  <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Welcome to <strong>PickMyCourse</strong></h1>
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hi <strong>${fname} ${lname}</strong>,</p>
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Welcome to <strong>PickMyCourse !</strong>, </p>
                  <p style="margin-left:0px;margin-right:0px;margin-top:5px;margin-bottom:5px;padding:0px;font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">We have received a request to update your email address associated with your account. To proceed with this request, please use the One-Time Password (OTP) provided below:</p>
                   <p style="margin-left:0px;margin-right:0px;margin-top:5px;margin-bottom:5px;padding:0px;font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Your OTP:<strong> ${otp} </strong></p>
                    <p style="margin-left:0px;margin-right:0px;margin-top:5px;margin-bottom:5px;padding:0px;font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">This OTP is valid for a limited time and will expire in 5 minutes. Please enter this code in the designated field to complete your email update.</p>                          
                  
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Thank you for your attention,<p target="_blank" style="color:rgb(0,0,0);text-decoration:none;text-decoration-line:none">The <strong>Seek My Course</strong> Team</p></p>
                  </td>
              </tr>
            </table>
          </body>
        
        </html>`,
  };

  await transporter.sendMail(mailOptions);
};

exports.validateOTP = async ({ email, otp }) => {
  const record = await OTP.findOne({ email });
  if (!record) {
    throw {
      status: 404,
      message: "No OTP record found or OTP expired",
      error: "OTP_NOT_FOUND",
    };
  }

  if (record.otp !== otp) {
    throw { status: 400, message: "Invalid OTP", error: "INVALID_OTP" };
  }

  await OTP.deleteOne({ email });
};
