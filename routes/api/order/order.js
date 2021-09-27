const express = require("express");
const router = express.Router();

// router.post("/create/orderId", (req, res) => {
//   console.log("create order id request", req.body);
//   var options = {
//     amount: req.body.amount, // amount in the smallest currency unit
//     ShippingDetails: req.body.ShippingDetails,
//     currency: "INR",
//     receipt: "rcpl",
//   };
//   instance.orders.create(options, function (err, order) {
//     console.log(order);
//     res.send({ orderId: order.id });
//   });
// });

// router.post("/payment/verify", (req, res) => {
//   let body =
//     req.body.response.razorpay_order_id +
//     "|" +
//     req.body.response.razorpay_payment_id;

//   var crypto = require("crypto");
//   var expectedSignature = crypto
//     .createHmac("sha256", "Wok5mJv2F0pa5HKLeXZfUr9r")
//     .update(body.toString())
//     .digest("hex");
//   console.log("sig received ", req.body.response.razorpay_signature);
//   console.log("sig generated ", expectedSignature);
//   var response = { signatureIsValid: "false" };
//   if (expectedSignature === req.body.response.razorpay_signature)
//     response = { signatureIsValid: "true" };
//   res.send(response);
// });
router.post('/', (req, res) => {
  console.log(req.body);
})

module.exports = router;
