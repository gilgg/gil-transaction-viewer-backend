const express = require("express");
const axios = require("axios");
require("dotenv").config();
const Customer = require("../models/customer");
const Transaction = require("../models/transaction");
const router = express.Router();

router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/customers/coords", async (req, res) => {
  let coords;
  const locationParam = `${req.body.city
    .toLowerCase()
    .replace(" ", "")},${req.body.country.toLowerCase().replace(" ", "")}`;

  if (/^[a-zA-Z,-]+$/.test(locationParam)) {
    // checking if the location is valid
    const coordsRaw = (
      await axios.get(
        `https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAP_QUEST_API_KEY}&location=${locationParam}`
      )
    ).data.results[0].locations[0].latLng;
    coords = [coordsRaw.lng, coordsRaw.lat];
  } else {
    coords = ["invalid"];
  }

  try {
    res.send(coords);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/customers/:id", async (req, res) => {
  try {
    await Transaction.deleteMany({ customer: req.params.id });
    await Customer.findByIdAndDelete(req.params.id);
    const transactions = await Transaction.find().populate("customer");
    res.send(transactions.reverse());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
