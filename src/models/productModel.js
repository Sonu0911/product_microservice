const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const ProductSchema = new mongoose.Schema(
    {
        sellerId: {
            type: ObjectId,
            ref: "seller",
            required: true
        },
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        type: {
            type: String,
            trim: true
        },
        category: {
            type: [String],
            enum: ["Electronics", "Clothing"],
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            trim: true
        },
        availableSizes: {
            type: [String],
            enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
            trim: true
        },
        deletedAt: {
            type: Date
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("product", ProductSchema);