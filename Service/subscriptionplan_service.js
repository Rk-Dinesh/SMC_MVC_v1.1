const SubscriptionPlan = require("../Model/subscriptionplan_model");

exports.createSubscriptionPlan = async (subscriptionPlanData) => {
  const newsubscriptionPlan = new SubscriptionPlan(subscriptionPlanData);
  return await newsubscriptionPlan.save();
};

exports.createAddUserPlan = async (subscriptionPlanData) => {
  const newSubscriptionPlan = new SubscriptionPlan(subscriptionPlanData);
  return await newSubscriptionPlan.save();
};

exports.updateSubscriptionPlan = async (id, subscriptionPlanData) => {
  return await SubscriptionPlan.findByIdAndUpdate(id, subscriptionPlanData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteSubscriptionPlan = async (id) => {
  return await SubscriptionPlan.findByIdAndDelete(id);
};

exports.getAllSubscriptionPlan = async () => {
  return await SubscriptionPlan.find();
}; 

exports.getAllSubscriptionPlanPackages = async () => {
  return await SubscriptionPlan.find().select("packagename ");
}; 

exports.getSubscriptionPlan = async (id) => {
  return await SubscriptionPlan.findById(id);
};

exports.getSubscriptionPlanByPackageName = async (packagename) => {
  return await SubscriptionPlan.findOne({ packagename }).select(
    "packagename  preCourses quizAccess studyGroupAccess "
  );
};
