const StatusService = require("../Service/status_service");

exports.createStatus = async (req, res, next) => {
    try {
        const { status, color } = req.body;
        const newStatus = await StatusService.createStatus({ status, color });

        res.status(200).json({
            success: true,
            message: "Status created successfully",
            Status: newStatus,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, color } = req.body;

        const updatedStatus = await StatusService.updateStatus(id, { status, color });

        if (!updatedStatus) {
            return res.status(404).json({ success: false, message: "Status not found" });
        }

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            Status: updatedStatus,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedStatus = await StatusService.deleteStatus(id);

        if (!deletedStatus) {
            return res.status(404).json({ success: false, message: "Status not found" });
        }

        res.status(200).json({
            success: true,
            message: "Status deleted successfully",
            Status: deletedStatus,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllStatuses = async (req, res, next) => {
    try {
        const statuses = await StatusService.getAllStatuses();
        res.status(200).json({ success: true, status: statuses });
    } catch (error) {
        next(error);
    }
};
