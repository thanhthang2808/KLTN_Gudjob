const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Đảm bảo mỗi user chỉ có một wallet
  },
  balance: {
    type: Number,
    default: 0,
  },
  lockedBalance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      amount: Number,
      type: {
        type: String,
        enum: ["credit", "debit", "lock", "unlock"],
      },
      description: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
