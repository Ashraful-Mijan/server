const express = require("express");
const Vendor = require("../../../models/admin/vendor");
const User = require("../../../models/user/user");
const router = express.Router();
const Enquiry = require("../../../models/admin/vendor");
const jwt = require("jsonwebtoken");
const config = require("config");

const bcrypt = require("bcryptjs");

const { check, validationResult } = require("express-validator/check");
router.post("/", async (req, res) => {
  const { firstname, lastname, email, password, vendorType } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const vendorField = {};
  if (firstname) vendorField.firstname = firstname;
  if (lastname) vendorField.lastname = lastname;
  if (email) vendorField.email = email;
  if (vendorType) vendorField.vendorType = vendorType;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    vendorField.password = await bcrypt.hash(password, salt);
  }

  try {
    let vendor = await Vendor.findOne({ email });
    let user = await User.findOne({ email: email });
    if (vendor || user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Vendor already present" }] });
    }
    vendor = new Vendor(vendorField);
    await vendor.save();
    const payload = {
      user: {
        id: vendor.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token }); //it will gives a token
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
    });
    if (!vendor) {
      res.status(400).send("not found");
    }
    res.status(201).json(vendor);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const vendor = await Vendor.find();
    if (!vendor) {
      res.status(400).send("not found");
    }
    res.status(201).json(vendor);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
