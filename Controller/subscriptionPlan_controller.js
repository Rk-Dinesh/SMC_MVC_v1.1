const Count = require("../Model/plancount_model");
const SubscriptionPlan = require("../Model/subscriptionplan_model");
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
      paymentId,
      duration,
      preCourses,
      quizAccess,
      studyGroupAccess,
    } = req.body;
    //  console.log('body',req.body);

    const newsubscriptionPlan =
      await SubscriptionPlanService.createSubscriptionPlan({
        packagename,
        price,
        inr,
        course,
        tax,
        subtopic,
        coursetype,
        paymentId,
        duration,
        preCourses,
        quizAccess,
        studyGroupAccess,
      });
    //   console.log("return", newsubscriptionPlan);

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
  const { packagename, email } = req.body;
  try {
    const existingPlan = await SubscriptionPlan.findOne({
      packagename: packagename,
    });

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }
    if (!email || !packagename) {
      return res.status(400).json({
        success: false,
        message: "Email, package name count are required",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findOneAndUpdate(
      { email: email },
      { $set: { type: packagename } }
    );

    const existingUser = await Count.findOne({ user: user._id });

    if (existingUser) {
      existingUser.count = existingPlan.course;
      await existingUser.save();
      return res.json({
        success: true,
        message: "Count updated for existing user",
      });
    }
    const course_count = new Count({
      user: user._id,
      count: existingPlan.course,
    });
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
    paymentId,
    duration,
    preCourses,
    quizAccess,
    studyGroupAccess,
  } = req.body;

  try {
    const existingPlan = await SubscriptionPlan.findById(id);
    if (!existingPlan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    if (!existingPlan.active) {
      return res.status(400).json({
        success: false,
        message: "Cannot update an inactive plan",
      });
    }

    const updatedPlan = await SubscriptionPlanService.updateSubscriptionPlan(
      id,
      {
        packagename,
        price,
        inr,
        course,
        tax,
        subtopic,
        coursetype,
        paymentId,
        duration,
        preCourses,
        quizAccess,
        studyGroupAccess,
      },
      { new: true, runValidators: true } // Returns the updated document and runs validators
    );

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      Plan: updatedPlan,
    });
    if (existingPlan.packagename !== req.body.packagename) {
      await User.updateMany(
        { packagename: existingPlan.packagename },
        { $set: { type: req.body.packagename } }
      );
    }
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
    const deletedPlan = await SubscriptionPlanService.deleteSubscriptionPlan(
      id
    );

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

exports.getAllSubscriptionPlanPackage = async (req, res) => {
  try {
    const plans = await SubscriptionPlanService.getAllSubscriptionPlanPackages();
    res.status(200).json({ success: true, data: plans });
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

exports.getSubscriptionPlanByPackageName = async (req, res) => {
  try {
    const { packagename } = req.query;
    const plan = await SubscriptionPlanService.getSubscriptionPlanByPackageName(
      packagename
    );
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
