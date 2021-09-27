const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const User = require("../../../models/user/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Vendor = require("../../../models/admin/vendor");
const { check, validationResult } = require("express-validator");

router.get("/", auth, async (req, res) => {
  if (req.user.id == 999) {
    return res.json("admin");
  }
  try {
    //res.send("hi");
    const user = await User.findById(req.user.id).select(-"password");
    if (user) {
      return res.json(user);
    } else {
      const vendor = await Vendor.findById(req.user.id);
      return res.json(vendor);
    }
  } catch (err) {
    return res.status(500).send("server errpor");
  }
});

router.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(400).send("bad request");
    }

    return res.json(user);
  } catch (err) {
    res.status(500).send("server error");
  }
});

router.get("/user/:id", async (req, res) => {
  console.log("in api");
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send("bad request");
    }

    return res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
router.post(
  "/",
  [
    //validators
    // check("name", "name is required").not().isEmpty(),
    check("email", "enter the valid email"),
    check("password", "enter proper password").isLength({ min: 6 }),
  ],

  async (req, res) => {
    //admin access
    const { email, password } = req.body;
    if (email == "vendor@brikk.com" && password == "123456") {
      const payload = {
        user: {
          id: 999,
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
    } else {
      //validations
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        let user = await User.findOne({ email });
        const vendor = await Vendor.findOne({ email: email });
        if (!user && !vendor) {
          return res
            .status(400)
            .json({ errors: [{ msg: "invalid user not found" }] });
        }
        //VENDOR TOKEN
        if (vendor) {
          const isMatch = await bcrypt.compare(password, vendor.password);
          console.log(isMatch);
          console.log(typeof password);
          if (!isMatch) {
            return res
              .status(400)
              .json({ errors: [{ msg: "invalid creadential" }] });
          }
          payload = {
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
        }

        //USER TOKEN
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res
              .status(400)
              .json({ errors: [{ msg: "invalid creadential" }] });
          }
          payload = {
            user: {
              id: user.id,
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
        }
      } catch (err) {
        //console.log(req.body);
        //res.send("user registered");
        console.log(err.message);
        return res.status(500).send("server error");
      }
    }
  }
);

module.exports = router;
