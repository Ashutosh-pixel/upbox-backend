const express = require("express");
const auth = require("../controllers/auth/authController");
const refresh = require("../services/refreshToken");
const authRouter = express.Router();

authRouter.post("/login", auth.login)
authRouter.post("/refresh", refresh)
authRouter.post("/signup", auth.signup);

module.exports = authRouter;