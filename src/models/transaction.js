const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: "Customer",
  },
  total_price: {
    type: Number,
    required: true,
    trim: true,
  },
  currency: {
    type: String,
    required: true,
    trim: true,
  },
  credit_card_type: {
    type: String,
    required: true,
    trim: true,
  },
  credit_card_number: {
    type: String,
    required: true,
    trim: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
