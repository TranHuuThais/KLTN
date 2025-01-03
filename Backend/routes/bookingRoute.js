const express = require("express");
const router = express.Router();
const {
  payment,
  callback,
  checkPaymentStatus,
  deleteBooking,
  getAll,
  getBookingByCode,
  getPaymentsByUser,
  getPaymentDetail,
  getAllPayments,
  getTotalIncomeForDay,
  deletePayment,
  deletePaymentById
} = require("../configs/momo");

router.post("/payment/:id", payment);
router.post("/callback", callback);
router.get("/checkpaymentstatus/:id", checkPaymentStatus);
router.get("/", getAll);
router.get("/payments", getAllPayments);
router.delete("/delete/:id", deleteBooking);
router.get("/code/:code", getBookingByCode);
router.get("/:userid", getPaymentsByUser);
router.delete("/:paymentId", deletePaymentById);
router.get("/payment/:paymentId", getPaymentDetail);
router.get('/dailytotal/:date', getTotalIncomeForDay);
router.get('/payment/:paymentId', getPaymentDetail);
router.delete('/payment/:paymentId', deletePayment);

module.exports = router;
