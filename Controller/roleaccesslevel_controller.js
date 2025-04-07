const RoleService = require("../Service/roleacesslevel_service");

exports.createRoleAccessLevel = async (req, res, next) => {
  try {
    const { role_name, accessLevels, status } = req.body;
    const roleData = { role_name, accessLevels, status };

    const result = await RoleService.createRoleAccessLevel(roleData);

    res.status(200).json({
      success: true,
      message: "Role access level created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRoleAccessLevel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_name, accessLevels, status } = req.body;

    if (!id || !role_name || !accessLevels || !status) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Please provide all required fields.",
      });
    }

    const updatedRole = await RoleService.updateRoleAccessLevel(id, { role_name, accessLevels, status });

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRoleAccessLevel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRole = await RoleService.deleteRoleAccessLevel(id);

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
      role: deletedRole,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await RoleService.getAllRoles();

    res.status(200).json({
      success: true,
      role:roles,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRoleByName = async (req, res, next) => {
  try {
    const { role_name } = req.query;

    const role = await RoleService.getRoleByName({role_name});

    res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    next(error);
  }
};