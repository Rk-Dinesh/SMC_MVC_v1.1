const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../Model/user_model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
const Admin = require("../Model/admin_model");
const Subscription = require("../Model/subscription_model");



exports.createOrder = async (options) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const order = await razorpay.orders.create(options);
        if (!order) {
            throw new Error("Failed to create order");
        }
        return order;
    } catch (error) {
        throw new Error("Error creating Razorpay order");
    }
};

exports.validatePayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature, uid, plan) => {

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
        throw new Error("Transaction is not legit!");
    }

    const updatedUser = await User.findOneAndUpdate(
        { _id: uid },
        { $set: { type: plan } },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return { msg: "success", orderId: razorpay_order_id, paymentId: razorpay_payment_id };
};

exports.cancelSubscription = async (userId) => {
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { type: "free" } },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return { success: true, message: "Type updated successfully" };
};



exports.createStripeSession = async (planId) => {
    try {
        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.WEBSITE_URL}/success`,
            cancel_url: `${process.env.WEBSITE_URL}/failed`,
            line_items: [
                {
                    price: planId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
        });
        return { url: session.url, id: session.id };
    } catch (error) {
        throw new Error("Failed to create Stripe session");
    }
};

exports.getStripeDetails = async (subscriberId, uid, plan) => {
    let cost = 0;
    if (plan === process.env.MONTH_TYPE) {
        cost = process.env.MONTH_COST;
    } else {
        cost = process.env.YEAR_COST;
    }
    cost = cost / 4;

    await Admin.findOneAndUpdate({ type: "main" }, { $inc: { total: cost } });

    const updatedUser = await User.findOneAndUpdate(
        { _id: uid },
        { $set: { type: plan } },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error("User not found");
    }

    const session = await stripe.checkout.sessions.retrieve(subscriberId);
    return session;
};

exports.cancelStripeSubscription = async (subscriptionId) => {
    try {

        const subscription = await stripe.subscriptions.cancel(subscriptionId);

        const subscriptionDetails = await Subscription.findOne({ subscriberId: subscriptionId });
        if (!subscriptionDetails) {
            throw new Error("Subscription not found");
        }

        const userId = subscriptionDetails.user;

        await User.findOneAndUpdate({ _id: userId }, { $set: { type: "free" } });

        await Subscription.findOneAndDelete({ subscriberId: subscriptionId });

        const userDetails = await User.findOne({ _id: userId });
        if (!userDetails) {
            throw new Error("User not found");
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const Reactivate = process.env.WEBSITE_URL + "/pricing";
        const mailOptions = {
            from: process.env.EMAIL,
            to: userDetails.email,
            subject: `${userDetails.fname} Your Subscription Plan Has Been Cancelled`,
            html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                <html lang="en">
                
                  <head></head>
                 <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Subscription Cancelled<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
                 </div>
                
                  <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
                    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
                      <tr style="width:100%">
                        <td>
                          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-top:32px">
                            <tbody>
                              <tr>
                                <td><img alt="Vercel" src="${process.env.LOGO}" width="40" height="37" style="display:block;outline:none;border:none;text-decoration:none;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px" /></td>
                              </tr>
                            </tbody>
                          </table>
                          <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Subscription Cancelled</h1>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">${userDetails.fname}, your subscription plan has been Cancelled. Reactivate your plan by clicking on the button below.</p>
                          <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-bottom:32px;margin-top:32px;text-align:center">
                               <tbody>
                                  <tr>
                                    <td><a href="${Reactivate}" target="_blank" style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px"</span><span>Reactivate</span></a></td>
                                  </tr>
                                </tbody>
                          </table>
                          <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Best,<p target="_blank" style="color:rgb(0,0,0);text-decoration:none;text-decoration-line:none">The <strong>${process.env.COMPANY}</strong> Team</p></p>
                          </td>
                      </tr>
                    </table>
                  </body>
                
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: "Subscription canceled successfully" };
    } catch (error) {
        throw new Error("Failed to cancel subscription");
    }
};