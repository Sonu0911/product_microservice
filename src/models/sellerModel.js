const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: "email is required",
        },
        password: {
            type: String,
            require: "password is required",
            trim: true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("seller", SellerSchema);