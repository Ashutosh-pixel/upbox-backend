const express = require("express");
const otpRateLimiter = require("../middleware/otp/otpMiddleware");
const { otpSendController, otpVerifyController } = require("../controllers/otp/otpController");
const auth = require("../controllers/auth/authController");
const OtpRoute = express.Router();

OtpRoute.post("/send", otpRateLimiter, otpSendController);
OtpRoute.post("/verify", otpVerifyController, auth.newAccount)

module.exports = OtpRoute;