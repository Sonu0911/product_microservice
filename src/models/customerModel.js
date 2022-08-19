const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    fname: {
      type: String,
      required: true,
      trim: true
    },
    lname: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      require: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String, 
        required: true,
        trim: true
      },
      pincode: {
        type: Number,
        required: true,
        trim: true
      }
    },
  },
  { timestamps: true });

module.exports = mongoose.model("customer", CustomerSchema);