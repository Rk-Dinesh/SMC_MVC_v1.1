const otpService = require("../Service/otp_service");

exports.createOTP = async (req, res, next) => {
    const { email,fname,lname } = req.body;
    try {
        const response = await otpService.createOTP({email,fname,lname});
        res.status(200).json({ success: true,  message: "newOTP created successfully", });
    } catch (error) {
        next(error);
    }
};

exports.validateOTP = async (req, res, next) => {
    const { email, otp } = req.body;
    
    try {
        const response = await otpService.validateOTP({email,otp});
        res.status(200).json({ success: true,  message: "OTP validated successfully.", });
    } catch (error) {
        next(error);
    }
};
