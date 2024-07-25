const auth = require("../middleware/auth");
const express = require("express");
const dotenv = require("dotenv").config();
const router = new express.Router();

router.post("/verify", auth, async (req, res) => {
  const otp = req.body.otp;
  console.log(req.body);

  try {
    if (otp === req.user.otp && req.user.verified === false) {
      req.user.verified = true;
      await req.user.save();
      res.status(200).send("Email verified successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    res.status(500).send("Error in email configuration");
  }
});

module.exports = router;
