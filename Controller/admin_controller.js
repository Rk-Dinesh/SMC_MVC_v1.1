const AdminService = require("../Service/admin_service");
const path = require("path");


exports.createAdmin = async (req, res, next) => {
    try {
        const {
            email,
            fname,
            lname,
            phone,
            dob,
            designation,
            password,
            type,
            logo,
            company,
        } = req.body;

        const newAdmin = await AdminService.createAdmin({
            email,
            fname,
            lname,
            phone,
            dob,
            designation,
            password,
            type,
            logo,
            company,
        });

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "An email has been sent to your account. Please verify.",
            userId: newAdmin._id,
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        const admin = await AdminService.verifyEmail(token);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            adminData: admin,
        });
    } catch (error) {
        next(error);
    }
};

exports.signInAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const admin = await AdminService.signInAdmin(email, password);

        res.status(200).json({
            success: true,
            message: "Sign-in successful",
            adminData: admin,
        });
    } catch (error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email, company } = req.body;

        const result = await AdminService.forgotPassword(email, company);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { password, token } = req.body;
        const result = await AdminService.resetPassword(password, token);

        res.status(200).json({
            success: true,
            message: result.message,
            email: result.email,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllAdmins = async (req, res, next) => {
    try {
        const admins = await AdminService.getAllAdmins();

        res.status(200).json({
            success: true,
            user: admins,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAdminById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const admin = await AdminService.getAdminById(id);

        res.status(200).json({
            success: true,
            user: admin,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Call the service to delete the admin
        const deletedAdmin = await AdminService.deleteAdmin(id);

        res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
            user: deletedAdmin,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { fname, lname, email, phone, dob, designation } = req.body;
        const updatedAdmin = await AdminService.updateAdmin(id, {
            fname,
            lname,
            email,
            phone,
            dob,
            designation,
        });

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            admin: updatedAdmin,
        });
    } catch (error) {
        next(error);
    }
};

exports.uploadCSV = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = path.join(__dirname, "./excel", req.file.filename);

        const result = await AdminService.uploadCSV(filePath);

        res.status(200).json({
            success: true,
            message: "Data uploaded successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { email } = req.query;
        const { confirmpassword } = req.body;

        const result = await AdminService.changePassword(email, confirmpassword);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};