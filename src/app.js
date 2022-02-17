const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");
const customerRouter = require("./routers/customer");
const transactionRouter = require("./routers/transaction");
const Customer = require("./models/customer");
const Transaction = require("./models/transaction");
const { loadFromFile } = require("./helpers/helpers");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/init", async (req, res) => {
  const { customersArr, transactionsArr } = loadFromFile();

  try {
    const customersNumber = await Customer.count();

    if (customersNumber === 0) {
      // in case this is the first write to the db
      // create all customers and insert them to the db
      customersArr.forEach(async (customer) => {
        const c = new Customer(customer);
        await c.save();
      });

      //create all transactions and insert them to the db
      transactionsArr.forEach(async (transaction) => {
        const t = new Transaction(transaction);
        await t.save();
      });
    }
    res.send("Initialization successful");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use(customerRouter);
app.use(transactionRouter);

app.listen(process.env.PORT || 5000);
