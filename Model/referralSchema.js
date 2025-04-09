const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrerName: { type: String, required: true }, 
    referralCode: { type: String, required: true, unique: true },
    referralLink: { type: String, required: true, unique: true },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    paidUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, { timestamps: true });

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;