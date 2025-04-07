const Roles = require("../Model/roleaccesslevel_model");


exports.createRoleAccessLevel = async (roleData) => {
  for (const accessLevel of roleData.accessLevels) {
    if (!accessLevel.permissions || accessLevel.permissions.length === 0) {
      throw new Error(`Permissions array is empty for feature ${accessLevel.feature}`);
    }
  }

  const newRole = new Roles(roleData);
  return await newRole.save();
};

exports.updateRoleAccessLevel = async (id, roleData) => {
  const updatedRole = await Roles.findByIdAndUpdate(id, roleData, { new: true });
  if (!updatedRole) {
    throw new Error("Role not found");
  }
  return updatedRole;
};

exports.deleteRoleAccessLevel = async (id) => {
  const deletedRole = await Roles.findByIdAndDelete(id);
  if (!deletedRole) {
    throw new Error("Role not found");
  }
  return deletedRole;
};

exports.getAllRoles = async () => {
  return await Roles.find();
};

exports.getRoleByName = async (rolename) => {
  const role = await Roles.findOne(rolename);
  if (!role) {
    throw new Error("Role not found");
  }
  return role;
};