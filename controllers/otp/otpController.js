const otpService = require("../../services/otpService");

const otpController = async (req, res) => {
    let { email } = req.body;
    try {
        const { timer, newotp } = await otpService(email.trim());
        return res.status(200).json({ message: "Otp send", successCode: timer, otp: newotp })
    } catch (error) {
        console.log("Error in otpcontroller", error);
        return res.status(500).json({ message: "otp not working", errorCode: "OTP_SERVICE_ERROR" })
    }
}

module.exports = otpController;