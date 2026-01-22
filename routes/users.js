var express = require("express");
const { User } = require("../model/user");
var router = express.Router();
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

/* GET users listing. */
router.post("/login", async function (req, res, next) {
  try {
    // Find the user by email
    // If the user present
    // hash the password
    // if hash is matched with user's hash then success
    // else fail
    // if user not found then throw error
    console.log(JSON.stringify(req.body))
    if (!req.body.email) {
      res.status(401).json({
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({
        message: "Invalid email or Password",
      });
    }

    // Generate hash and compare
    const hashResult = bcryptjs.compareSync(req.body.password, user.password);

    if (hashResult) {
      const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET,{expiresIn : "1h"});
      res.status(200).json({
        message: "User logged in successfully",
        token,
        name : user.name
      });
    } else {
      res.status(401).json({
        message: "Invalid email or Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error logging in user",
    });
  }
});

router.post("/register", async function (req, res, next) {
  try {
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    console.log(hashedPassword);
    req.body.password = hashedPassword;
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.json({
      message: "Error registering user",
    });
  }
});

module.exports = router;
