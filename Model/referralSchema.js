const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrerId: {type:String},
    referrerName: { type: String, required: true }, 
    referralCode: { type: String, required: true, unique: true },
    referralLink: { type: String, required: true, unique: true },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    paidUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commission: { type: Number, default: 0 }, // Commission earned   
}, { timestamps: true });

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;