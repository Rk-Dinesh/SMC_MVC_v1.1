const Referral = require("../Model/referralSchema");
const { generateRandomString } = require("../utils");



exports.createReferralLink = async (referrerName) => {
    try {
        const uniqueIdentifier = generateRandomString(40); 
        const referralCode = `seekmycourse/ref/${referrerName}/${uniqueIdentifier}`;
        const referralLink = `http://localhost:5173/signup/?ref=${referralCode}`;

        const referral = new Referral({
            referrerName,
            referralCode,
            referralLink,
            referredUsers: [],
            paidUsers: []
        });

        await referral.save();

        return referralLink;
    } catch (error) {
        throw new Error('Failed to create referral link.');
    }
};

exports.getReferralDetails = async (referralCode) => {
    try {
        const referral = await Referral.findOne({ referralCode })
            .populate('referredUsers') 
            .populate('paidUsers');  

        if (!referral) {
            throw new Error('Referral not found.');
        }

        return referral;
    } catch (error) {
        throw new Error(`Failed to fetch referral details: ${error.message}`);
    }
};

exports.getReferralAllDetails = async () => {
    try {
        const referral = await Referral.find()
            .populate('referredUsers') 
            .populate('paidUsers');  

        if (!referral) {
            throw new Error('Referral not found.');
        }

        return referral;
    } catch (error) {
        throw new Error(`Failed to fetch referral details: ${error.message}`);
    }
};

exports.deleteReferral = async (id) =>{
    return await Referral.findByIdAndDelete(id);
}