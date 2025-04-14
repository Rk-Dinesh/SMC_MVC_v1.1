const AccountDetails = require("../Model/acc_details_model");

exports.addBankDetails = async (userId, bankDetails) => {
    let accountDetails = await AccountDetails.findOne({ user: userId });

    if (!accountDetails) {
        accountDetails = new AccountDetails({
            user: userId,
            acc_details: [bankDetails],
        });
    } else {
        const existingAccounts = accountDetails.acc_details;
        const accountExists = existingAccounts.some(acc => acc.acc === bankDetails.acc);

        if (accountExists) {
            throw new Error('Bank account already exists');
        } else {
            accountDetails.acc_details.push(bankDetails);
        }
    }

    await accountDetails.save();
    return accountDetails;
};

exports.getAllAccountDetails = async () => {
    return await AccountDetails.find();
};

exports.getAccountDetailsByUser  = async (userId) => {
    return await AccountDetails.findOne({ user: userId });
};