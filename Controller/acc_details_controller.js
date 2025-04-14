const AccountService = require("../Service/acc_details_service");

exports.postBankDetails = async (req, res) => {
    const { userId, bankDetails } = req.body;

    try {
        const updatedAccountDetails = await AccountService.addBankDetails(userId, bankDetails);
        return res.status(200).json({
            success: true,
            message: 'Bank details added successfully',
            data: updatedAccountDetails,
        });
    } catch (error) {
        console.error(error);
        if (error.message === 'Bank account already exists') {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating bank details',
            error: error.message,
        });
    }
};

exports.getAllAccountDetails = async (req, res) => {
    try {
        const accountDetails = await AccountService.getAllAccountDetails();
        return res.status(200).json({
            success: true,
            data: accountDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving account details',
            error: error.message,
        });
    }
};

exports.getAccountDetailsByUser  = async (req, res) => {
    const { user } = req.query; 
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required',
        });
    }
    try {
        const accountDetails = await AccountService.getAccountDetailsByUser(user);
        if (!accountDetails) {
            return res.status(404).json({
                success: false,
                message: 'No account details found for this user',
            });
        }
        return res.status(200).json({
            success: true,
            data: accountDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving account details',
            error: error.message,
        });
    }
};