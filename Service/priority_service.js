const Priority = require("../Model/priority_model");

exports.createPriority = async (priorityData) => {
    const newPriority = new Priority(priorityData);
    return await newPriority.save();
};

exports.updatePriority = async (id, priorityData) => {
    return await Priority.findByIdAndUpdate(id, priorityData, { new: true, runValidators: true });
};

exports.deletePriority = async (id) => {
    return await Priority.findByIdAndDelete(id);
};

exports.getAllPriorities = async () => {
    return await Priority.find();
};
