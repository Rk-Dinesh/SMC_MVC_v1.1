const PriorityService = require("../Service/priority_service");

exports.createPriority = async (req, res, next) => {
    try {
        const { priority } = req.body;
        const newPriority = await PriorityService.createPriority({ priority });

        res.status(200).json({
            success: true,
            message: "Priority created successfully",
            Priority: newPriority,
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePriority = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        const updatedPriority = await PriorityService.updatePriority(id, { priority });

        if (!updatedPriority) {
            return res.status(404).json({ success: false, message: "Priority not found" });
        }

        res.status(200).json({
            success: true,
            message: "Priority updated successfully",
            priority: updatedPriority,
        });
    } catch (error) {
        next(error);
    }
};

exports.deletePriority = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPriority = await PriorityService.deletePriority(id);

        if (!deletedPriority) {
            return res.status(404).json({ success: false, message: "Priority not found" });
        }

        res.status(200).json({
            success: true,
            message: "Priority deleted successfully",
            Priority: deletedPriority,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllPriorities = async (req, res, next) => {
    try {
        const priorities = await PriorityService.getAllPriorities();
        res.status(200).json({ success: true, priority: priorities });
    } catch (error) {
        next(error);
    }
};
