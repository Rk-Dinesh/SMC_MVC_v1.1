const mongoose = require("mongoose");

const AccountDetailsSchema = new mongoose.Schema(
    {
        user: String,
        acc_details: [
            {
                acc: String,
                accname: String,
                ifsc: String,
                bank_name: String,
                branch: String,
                time: { type: Date, default: Date.now },
                date: { type: Date, default: Date.now },
                status: { type: String, default: "active" },
            },
        ],
    },
    { timestamps: true }
);

const AccountDetails = mongoose.model("AccountDetails", AccountDetailsSchema);
module.exports = AccountDetails;