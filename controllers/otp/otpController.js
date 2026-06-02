const otpService = require("../../services/otpService");
const redisClient = require("../../utils/redis/redis");
const emailController = require("../email/emailController");

const otpSendController = async (req, res) => {
    let { email } = req.body;
    try {
        const { timer, newotp } = await otpService(email.trim());

        /* ---------------- Email controller ----------------- */
        req.body.otp = newotp;
        await emailController(req, res);
        /* ---------------------------------------------------- */

        return res.status(200).json({ message: "Otp send", successCode: timer })
    } catch (error) {
        console.log("Error in otpcontroller", error);
        return res.status(500).json({ message: "otp not working", errorCode: "OTP_SERVICE_ERROR" })
    }
}

const otpVerifyController = async (req, res, next) => {
    let { email, otp } = req.body;

    email = email.trim();
    otp = otp.trim();

    try {
        if (!otp.trim()) {
            return res.status(400).json({ message: "OTP missing", errorCode: "OTP_MISSING" })
        }

        if (!email.trim()) {
            return res.status(400).json({ message: "Email missing", errorCode: "EMAIL_MISSING" })
        }

        const otpkey = `otp:${email}`
        const cooldownkey = `cooldown:${email}`
        const storedOtp = await redisClient.get(otpkey);

        if (!storedOtp || storedOtp !== otp) {
            return res.status(400).json({ message: "OTP wrong", errorCode: "OTP_WRONG" })
        }

        await redisClient.del(otpkey);
        await redisClient.del(cooldownkey);

        next();

        // return res.status(200).json({ message: "OTP matched", successCode: "OTP_MATCHED" });

    } catch (error) {
        console.log("error in otpcontroller", error);
        return res.status(500).json({
            message: "otp service down", errorCode: "OTP_SERVICE_DOWN"
        });
    }
}

module.exports = { otpSendController, otpVerifyController };