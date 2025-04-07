const Count = require("../Model/plancount_model");
const User = require("../Model/user_model");
const SubscriptionPlanService = require("../Service/subscriptionplan_service");

exports.createSubscriptionPlan = async (req, res) => {
  try {
    const {
      packagename,
      price,
      inr,
      course,
      tax,
      subtopic,
      coursetype,
      stripeId,
      duration
    } = req.body;
    console.log('body',req.body);
    
    const newsubscriptionPlan =
      await SubscriptionPlanService.createSubscriptionPlan({
        packagename,
        price,
        inr,
        course,
        tax,
        subtopic,
        coursetype,
        stripeId,
        duration
      });
      console.log("return", newsubscriptionPlan);
      
    res.status(200).json({
      success: true,
      message: "Plan created successfully",
      Plan: newsubscriptionPlan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.createAddUserPlan = async (req, res) => {
  const { packagename, email, course } = req.body;
  try {
    await User.findOneAndUpdate(
      { email: email },
      { $set: { type: packagename } }
    );

    const wantuser = await User.findOne({ email });
    if (!wantuser) {
      return res.status().json({ success: false, message: "User not found" });
    }

    const existingUser = await Count.findOne({ user: wantuser._id });

    if (existingUser) {
      existingUser.count = course;
      await existingUser.save();
      return res.json({
        success: true,
        message: "Count updated for existing user",
      });
    }
    const course_count = new Count({ user: wantuser._id, count: course });
    await course_count.save();
    return res.json({
      success: true,
      message: "New user added with course count",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.updateSubscriptionPlan = async (req, res) => {
  const { id } = req.params;
  const {
    packagename,
    price,
    inr,
    course,
    tax,
    subtopic,
    coursetype,
    stripeId,
    duration
  } = req.body;

  try {
    const updatedPlan = await SubscriptionPlanService.updateSubscriptionPlan(
      id,
      { packagename, price, inr, course, tax, subtopic, coursetype, stripeId,duration },
      { new: true, runValidators: true } // Returns the updated document and runs validators
    );

    if (!updatedPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      Plan: updatedPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteSubscriptionPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlan = await SubscriptionPlanService.deleteSubscriptionPlan(id);

    if (!deletedPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
      Plan: deletedPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllSubscriptionPlan = async (req, res) => {
  try {
    const plans = await SubscriptionPlanService.getAllSubscriptionPlan();
    res.status(200).json({ success: true, plans: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlanService.getSubscriptionPlan(id);
    res.status(200).json({ success: true, plan: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
