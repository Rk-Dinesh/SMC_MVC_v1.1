const PaymentService = require("../Service/payment_service");

exports.createOrder = async (req, res, next) => {
    try {
        const options = req.body;

        const order = await PaymentService.createOrder(options);

        res.json(order);
    } catch (error) {
        next(error);
    }
};

exports.validatePayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, uid, plan } = req.body;

        const result = await PaymentService.validatePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature, uid, plan);

        res.json(result);
    } catch (error) {
        if (error.message === "Transaction is not legit!") {
            return res.status(400).json({ msg: "Transaction is not legit!" });
        }
        next(error);
    }
};

exports.cancelSubscription = async (req, res, next) => {
    try {
        const { user } = req.body;

        const result = await PaymentService.cancelSubscription(user);

        res.json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        next(error);
    }
};

exports.createStripeSession = async (req, res, next) => {
    try {
        const { planId } = req.body;
        const session = await PaymentService.createStripeSession(planId);

        res.json(session);
    } catch (error) {
        next(error);
    }
};

exports.getStripeDetails = async (req, res, next) => {
    try {
        const { subscriberId, uid, plan } = req.body;
        const session = await PaymentService.getStripeDetails(subscriberId, uid, plan);

        res.send(session);
    } catch (error) {
        next(error);
    }
};

exports.cancelStripeSubscription = async (req, res, next) => {
    try {
        const { id } = req.body;

        const result = await PaymentService.cancelStripeSubscription(id);

        res.json(result);
    } catch (error) {
        next(error);
    }
};