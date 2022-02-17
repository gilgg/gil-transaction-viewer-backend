const fs = require("fs");
const path = require("path");

const loadFromFile = () => {
  const dataBuffer = fs.readFileSync(path.resolve(__dirname, "../data.json"));
  const dataJSON = dataBuffer.toString();
  const dataArr = JSON.parse(dataJSON);

  let customersArr = [];
  let transactionsArr = [];

  dataArr.forEach((data) => {
    const transaction = {
      customer: data.customer_id,
      total_price: data.total_price,
      currency: data.currency,
      credit_card_type: data.credit_card_type,
      credit_card_number: data.credit_card_number,
    };

    const customer = {
      _id: data.customer_id,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      gender: data.gender,
      country: data.country,
      city: data.city,
      street: data.street,
      phone: data.phone,
    };

    transactionsArr.push(transaction);
    customersArr.push(customer);
  });

  return { customersArr, transactionsArr };
};

module.exports = { loadFromFile };
