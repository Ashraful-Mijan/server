const express = require("express");
const app = express();
const Razorpay = require("razorpay");
const dbconnect = require("./config/db");
const cors = require("cors");

dbconnect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server connected at port no ${PORT}`));

var instance = new Razorpay({
  key_id: "rzp_test_U0fSSjWb1CGMEP",
  key_secret: "INMHYxiLaOwUJF6Ls4icOLh4",
});
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Server started");
});

app.use(express.json({ extended: false }));
app.use("/api/user", require("./routes/api/user/user"));
app.use("/api/auth", require("./routes/api/user/auth"));
app.use("/api/admin/vendor", require("./routes/api/admin/vendor"));
app.use("/api/order", require("./routes/api/order/order"));
app.use("/api/razorpay", require("./routes/api/razorpay/pay"));
