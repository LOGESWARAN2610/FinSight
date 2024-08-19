const { dataBase } = require("../config/db.config.js");
require("dotenv").config();
const fs = require("fs");
const paymentDetailsCollection = dataBase.collection("PaymentDetails");

const getPaymentDetailsForDates = async ({ body: params }, res) => {
  try {
    let { eDate, sDate } = params;

    const result = paymentDetailsCollection.aggregate([
      {
        $match: {
          date: {
            $gte: sDate,
            $lte: eDate,
          },
        },
      },
    ]);
    const resultArray = await result.toArray();
    console.log(resultArray);
    res.json(resultArray);
  } catch (err) {
    res.status(500);
    console.log(err["message"]);
    res.send(err["message"]);
  }
};

module.exports = { getPaymentDetailsForDates };
