const Notify = require("../Model/notification_model");

exports.createNotification = async (notificationData) => {
    const newNotify = new Notify(notificationData);
    return await newNotify.save();
};

exports.getAllNotifications = async () => {
    return await Notify.find();
};

exports.getNotificationsByUser = async (user) => {
    return await Notify.find({ user });
};

exports.updateNotificationsByUser = async (user) => {
    return await Notify.updateMany({ user }, { $set: { read: "yes" } });
};
