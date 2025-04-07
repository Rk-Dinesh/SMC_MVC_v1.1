const Status = require("../Model/status_model");

exports.createStatus = async (statusData) => {
    const newStatus = new Status(statusData);
    return await newStatus.save();
};

exports.updateStatus = async (id, statusData) => {
    return await Status.findByIdAndUpdate(id, statusData, { new: true, runValidators: true });
};

exports.deleteStatus = async (id) => {
    return await Status.findByIdAndDelete(id);
};

exports.getAllStatuses = async () => {
    return await Status.find();
};
