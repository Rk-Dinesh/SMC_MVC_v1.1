const mongoose = require("mongoose");

const RoleAccessLevelSchema = new mongoose.Schema(
    {
      role_name: String,
      accessLevels: [
        {
          feature: String,
          permissions: [String],
        },
      ],
      status: String,
    },
    { timestamps: true }
  );

  const Roles = mongoose.model("Roles", RoleAccessLevelSchema);
  module.exports = Roles;