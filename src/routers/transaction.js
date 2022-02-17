const express = require("express");
require("dotenv").config();
const Customer = require("../models/customer");
const Transaction = require("../models/transaction");
const router = express.Router();

router.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("customer");
    res.send(transactions.reverse());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    await transaction.populate("customer");
    res.send(transaction);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/transactions/new", async (req, res) => {
  let newCustomer = {
    _id: req.body.customer_id,
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    country: req.body.country,
    city: req.body.city,
    street: req.body.street,
    phone: req.body.phone,
  };

  const newTransaction = {
    customer: req.body.customer_id,
    total_price: req.body.total_price,
    currency: req.body.currency.toUpperCase(),
    credit_card_type: req.body.credit_card_type,
    credit_card_number: req.body.credit_card_number,
  };

  const existingCustomer = await Customer.findById(req.body.customer_id);
  if (existingCustomer) {
    delete newCustomer._id;
    await Customer.findByIdAndUpdate(req.body.customer_id, newCustomer);
  } else {
    const customer = new Customer(newCustomer);
    await customer.save();
  }

  try {
    const transaction = new Transaction(newTransaction);
    await transaction.save();
    const transactions = await Transaction.find().populate("customer");
    res.send(transactions.reverse());
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

router.patch("/transactions/edit/:id", async (req, res) => {
  const updatedCustomer = {
    _id: req.body.customer_id,
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    country: req.body.country,
    city: req.body.city,
    street: req.body.street,
    phone: req.body.phone,
  };
  const updatedTransaction = {
    customer: req.body.customer_id,
    total_price: req.body.total_price,
    currency: req.body.currency,
    credit_card_type: req.body.credit_card_type,
    credit_card_number: req.body.credit_card_number,
  };

  try {
    await Customer.findByIdAndUpdate(req.body.customer_id, updatedCustomer);
    await Transaction.findByIdAndUpdate(req.params.id, updatedTransaction);
    const transactions = await Transaction.find().populate("customer");
    res.send(transactions.reverse());
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

router.delete("/transactions/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    const transactions = await Transaction.find().populate("customer");
    res.send(transactions.reverse());
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = router;
