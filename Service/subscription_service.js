require('dotenv').config();
const crypto = require("crypto");
const Subscription = require("../Model/subscription_model");
const User = require("../Model/user_model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");
const Count = require('../Model/plancount_model');
const Referral = require('../Model/referralSchema');


exports.getSubscriptionDetails = async (uid) => {
  const userDetails = await Subscription.findOne({ user: uid });
  if (!userDetails) {
    throw new Error("Subscription not found for this user");
  }

  let subscriptionDetails;

  if (userDetails.method === "stripe") {
    subscriptionDetails = await stripe.subscriptions.retrieve(userDetails.subscriberId);
    return { session: subscriptionDetails, method: userDetails.method };
  } else if (userDetails.method === "paypal") {
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_APP_SECRET_KEY = process.env.PAYPAL_APP_SECRET_KEY;
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET_KEY).toString("base64");

    const response = await fetch(
      `https://api-m.paypal.com/v1/billing/subscriptions/${userDetails.subscription}`,
      {
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const session = await response.json();
    return { session, method: userDetails.method };
  } else if (userDetails.method === "paystack") {
    const authorization = `Bearer ${process.env.PAYSTACK_SECRET_KEY}`;
    const response = await axios.get(
      `https://api.paystack.co/subscription/${userDetails.subscriberId}`,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );

    const paystackDetails = {
      subscription_code: response.data.data.subscription_code,
      createdAt: response.data.data.createdAt,
      updatedAt: response.data.data.updatedAt,
      customer_code: userDetails.subscription,
      email_token: response.data.data.email_token,
    };

    return { session: paystackDetails, method: userDetails.method };
  } else if (userDetails.method === "razorpay") {
    const YOUR_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const YOUR_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    const SUBSCRIPTION_ID = userDetails.subscription;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: YOUR_KEY_ID,
        password: YOUR_KEY_SECRET,
      },
    };

    const response = await axios.get(
      `https://api.razorpay.com/v1/subscriptions/${SUBSCRIPTION_ID}`,
      config
    );

    return { session: response.data, method: userDetails.method };
  } else {
    throw new Error("Unsupported payment method");
  }
};

exports.createSubscription = async (
  user,
  fname,
  lname,
  email,
  phone,
  amount,
  course,
  subscription,
  subscriberId,
  plan,
  method,
  tax,
  duration
) => {
  const token = crypto.randomBytes(2).toString("hex");
  const recieptId = `Reciept${token}`;

  const newSub = new Subscription({
    recieptId,
    user,
    fname,
    lname,
    email,
    phone,
    amount,
    course,
    subscription,
    subscriberId,
    plan,
    method,
    tax,
    duration,
  });

  await newSub.save();

  const updatedUser = await User.findOneAndUpdate(
    { _id: user },
    { $set: { type: plan } },
    { new: true }
  );

  if (updatedUser.referrerId && !updatedUser.isPaid) {
    await User.findByIdAndUpdate(user, { $set: { isPaid: true } });

    const referral = await Referral.findById(updatedUser.referrerId);

    if (referral) {
      referral.paidUsers.push(updatedUser._id);
      referral.commission += 50; 
      await referral.save();
    }
  }

  return newSub;
};


exports.getAllSubscriptions = async () => {
  const subscriptions = await Subscription.find();
  if (!subscriptions || subscriptions.length === 0) {
    throw new Error("No subscriptions found");
  }
  return subscriptions;
};

exports.getSubscriptionsByUserId = async (userId) => {
  const subscriptions = await Subscription.find({ user: userId });
  if (!subscriptions || subscriptions.length === 0) {
    throw new Error("No subscriptions found for this user");
  }
  return subscriptions;
};

exports.getSubscriptionById = async (id) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new Error("Subscription not found");
  }
  return subscription;
};
