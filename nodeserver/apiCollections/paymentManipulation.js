const { ObjectId } = require("mongodb");
const { dataBase } = require("../config/db.config.js");
require("dotenv").config();
const fs = require("fs");
const paymentDetailsCollection = dataBase.collection("PaymentDetails");

const getPaymentDetails = async ({ body: params }, res) => {
  try {
    let { date } = params;
    const resultCursor = paymentDetailsCollection.aggregate([
      {
        $addFields: {
          datePart: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: { $toDate: "$date" },
            },
          },
        },
      },
      {
        $match: {
          datePart: date,
        },
      },
    ]);
    const resultArray = await resultCursor.toArray();
    res.json(resultArray);
  } catch (err) {
    res.status(500);
    res.send(err["message"]);
  }
};
const addPayment = async ({ body: params }, res) => {
  try {
    const result = await paymentDetailsCollection.insertOne(params);
    res.json({ status: "Success" });
  } catch (err) {
    res.status(500);
    res.send(err["message"]);
  }
};
const UpdatePayment = async ({ body: params }, res) => {
  try {
    const { _id, invoice } = params;

    try {
      const result = await paymentDetailsCollection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { invoice: invoice } }
      );
    } catch (error) {
      console.error("Error form UpdatePayment ====> ", error);
    }

    res.json({ status: "Success" });
  } catch (err) {
    res.status(500);
    res.send(err["message"]);
  }
};
const storeInvoice = async ({ body: params }, res) => {
  try {
    const { file: fileArray } = params,
      filePath = process["env"]["INVOICE_PATH"];

    const result = fileArray.map((imageData, index) => {
      const base64String = imageData["base64"],
        base64Data = base64String.replace(/^data:image\/\w+;base64,/, ""),
        buffer = Buffer.from(base64Data, "base64"),
        fileName = generateAlphanumeric(10) + ".png";

      fs.writeFile(filePath + fileName, buffer, (err) => {
        if (err) {
          console.error("Error:", err);
        } else {
          // console.log("File saved successfully:", filePath);
        }
      });
      return fileName;
    });

    res.json(result);
  } catch (err) {
    res.status(500);
    res.send(err["message"]);
  }
};
const generateAlphanumeric = (length = 10) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }

  return result;
};

module.exports = { addPayment, getPaymentDetails, storeInvoice, UpdatePayment };
