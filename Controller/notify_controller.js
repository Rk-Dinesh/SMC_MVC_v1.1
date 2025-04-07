const NotifyService = require("../Service/notify_service");

exports.createNotification = async (req, res, next) => {
    try {
        const { user, subject, description } = req.body;
        const newNotify = await NotifyService.createNotification({ user, subject, description, read: "no" });

        res.status(200).json({
            success: true,
            message: "Notification created successfully",
            Notification: newNotify,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllNotifications = async (req, res, next) => {
    try {
        const notify = await NotifyService.getAllNotifications();
        res.status(200).json({ success: true, notify });
    } catch (error) {
        next(error);
    }
};

exports.getNotificationsByUser = async (req, res, next) => {
    try {
        const { user } = req.query;
        if (!user) {
            return res.status(400).json({ success: false, message: "User query parameter is required" });
        }

        const notify = await NotifyService.getNotificationsByUser(user);
        if (notify.length === 0) {
            return res.status(404).json({ success: false, message: "No notifications found for this user" });
        }

        res.status(200).json({ success: true, notify });
    } catch (error) {
        next(error);
    }
};

exports.updateNotificationsByUser = async (req, res, next) => {
    try {
        const { user } = req.query;
        if (!user) {
            return res.status(400).json({ success: false, message: "User query parameter is required" });
        }

        const result = await NotifyService.updateNotificationsByUser(user);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "No notifications found to update for this user" });
        }

        res.status(200).json({
            success: true,
            message: "Notifications updated successfully",
            updatedCount: result.modifiedCount,
        });
    } catch (error) {
        next(error);
    }
};
