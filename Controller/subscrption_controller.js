const SubscriptionService = require("../Service/subscription_service");

exports.getSubscriptionDetails = async (req, res, next) => {
    try {
      const { uid } = req.body;
  
      const subscriptionData = await SubscriptionService.getSubscriptionDetails(uid);
  
      res.status(200).json(subscriptionData);
    } catch (error) {
      next(error);
    }
  };

exports.createUserSubscription = async (req, res, next) => {
  try {
    const {
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
    } = req.body;

    const newSub = await SubscriptionService.createSubscription(
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
    );

    res.status(200).json({
      success: true,
      message: "New subscription created successfully",
      newSub,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await SubscriptionService.getAllSubscriptions();

    res.status(200).json({ success: true, sub: subscriptions });
  } catch (error) {
    next(error);
  }
};

exports.getSubscriptionsByUserId = async (req, res, next) => {
  try {
    const { user } = req.query;

    const subscriptions = await SubscriptionService.getSubscriptionsByUserId(user);

    res.status(200).json({ success: true, sub: subscriptions });
  } catch (error) {
    next(error);
  }
};

exports.getSubscriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await SubscriptionService.getSubscriptionById(id);

    res.status(200).json({ success: true, sub: subscription });
  } catch (error) {
    next(error);
  }
};