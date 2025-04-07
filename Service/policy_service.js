const Policies = require("../Model/policies_model");

exports.updatePolicy = async (policyData) => {
    return await Policies.findOneAndUpdate({}, { $set: policyData }, { new: true, upsert: true });
  };
  
  exports.getPolicy = async () => {
    return await Policies.findOne({});
  };
  
  exports.deletePolicy = async () => {
    return await Policies.deleteOne({});
  };