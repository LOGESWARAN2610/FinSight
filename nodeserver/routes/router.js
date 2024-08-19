const express = require("express");
const router = express.Router();
const {
  signIn,
  signUp,
  forgotPassword,
  resendOTP,
  updatePassword,
} = require("../apiCollections/signInUp.js");
const {
  addPayment,
  getPaymentDetails,
  storeInvoice,
  UpdatePayment,
} = require("../apiCollections/paymentManipulation.js");
const {
  getPaymentDetailsForDates,
} = require("../apiCollections/paymentRetrieval.js");

router.use("/signUp", signUp);
router.use("/signIn", signIn);
router.use("/resendOTP", resendOTP);
router.use("/updatePassword", updatePassword);
router.use("/forgotPassword", forgotPassword);
router.use("/addPayment", addPayment);
router.use("/UpdatePayment", UpdatePayment);
router.use("/getPaymentDetails", getPaymentDetails);
router.use("/storeInvoice", storeInvoice);
router.use("/getPaymentDetailsForDates", getPaymentDetailsForDates);

module.exports = router;
