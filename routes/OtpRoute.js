const express = require("express");
const otpRateLimiter = require("../middleware/otp/otpMiddleware");
const otpController = require("../controllers/otp/otpController");
const OtpRoute = express.Router();

OtpRoute.post("/send", otpRateLimiter, otpController);

module.exports = OtpRoute;