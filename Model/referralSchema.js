const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrerId: {type:String},
    referrerName: { type: String, required: true }, 
    referralCode: { type: String, required: true, unique: true },
    referralLink: { type: String, required: true, unique: true },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    paidUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commission: { type: Number, default: 0 },
    commissionDetails : [{
        amount: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    }] // Commission earned   
}, { timestamps: true });

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;