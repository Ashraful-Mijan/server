const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../../../models/user/user");
const Vendor = require("../../../models/admin/vendor");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post(
  "/",
  [
    check("firstname", "Name is required").not().isEmpty(),
    check("lastname", "Lastname is required").not().isEmpty(),
    check("email", "enter the valid Email").isEmail(),
    check("password", "enter proper password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //check user already exits or not
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exists" }] });
      }
      //CREATE AVATAR
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      user = new User({
        firstname,
        lastname,
        email,
        avatar,
      });

      //BCRYPT HASHING
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //JASON WEB TOKEN

      const payload = {
        user: {
          id: user.id,
        },
      };

      //jwt method

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token }); //it will gives a token
        }
      );

      //console.log(req.body);
      //res.send("user registered");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

//delete a user by id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      return res.json({ msg: "User removed" });
    } else {
      const vendor = await Vendor.findById(req.params.id);
      await vendor.remove();
      return res.json({ msg: "Vendor removed" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
