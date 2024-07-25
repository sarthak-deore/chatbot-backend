const auth = require("../middleware/auth");
const express = require("express");

const router = new express.Router();

const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

router.post("/mail", auth, async (req, res) => {
  try {
    const user = req.user; 

    // Check if the user is not verified
    if (user.verified === false) {
      const email = user.email;
      console.log(email);

      // Generate OTP
      const otp = await user.generateOTP();
      console.log(otp);

      // Save OTP to the user
      user.otp = otp;
      await user.save();

      // Configure email transport
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: "TLSv1.2",
        },
      });

      // Create email message
      const message = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "One Time Password for Chat App",
        text: "Hi, your email verification OTP for the Chat App is: " + otp,
      };

      // Send email
      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error in sending email");
        } else {
          console.log(info.response);
          res.status(250).send("Email sent successfully");
        }
      });
    } else {
      res.status(400).send("User is already verified");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in email configuration");
  }
});

module.exports = router;
