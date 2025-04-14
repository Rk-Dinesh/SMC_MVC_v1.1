const Count = require("../Model/plancount_model");

exports.createOrUpdateCount = async (user, count) => {
  const existingUser = await Count.findOne({ user });

  if (existingUser) {
    existingUser.count += count;
    return await existingUser.save();
  }

  const course_count = new Count({ user, count });
  return await course_count.save();
};

exports.decrementCount = async (user) => {
  const existingUser = await Count.findOne({ user });

  if (!existingUser) return null;

  return await Count.findOneAndUpdate(
    { user },
    { $set: { count: existingUser.count - 1 } },
    { new: true }
  );
};

exports.getCountByUser = async (user) => {
  return await Count.find({ user });
};
