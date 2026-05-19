const redisClient = require("../../utils/redis/redis");

const otpRateLimiter = async (req, res, next) => {
    let { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "email is required", errorCode: "MISSING_EMAIL" })
        }

        email = email.trim()
        const cooldownKey = `cooldown:${email}`;
        const cooldown = await redisClient.get(cooldownKey);

        if (!cooldown) {

            const totalOtpskey = `TotalOtps:${email}`;
            const totalOtps = Number(await redisClient.get(totalOtpskey)) || 0;
            const maxOtps = Number(process.env.TOTAL_OTPS) || 5;

            if (!totalOtps) {
                return next();
            }

            else if (totalOtps < maxOtps) {
                return next();
            }

            return res.status(429).json({ message: "OTP limit reached", errorCode: "OTP_LIMIT_REACHED" });
        }

        return res.status(429).json({
            message: "cooldown is active", errorCode: "COOLDOWN_ACTIVE",
            retryAfter: cooldown
        });

    } catch (error) {
        console.log("error in otpmiddleware", error);
        return res.status(500).json({
            message: "otp service down", errorCode: "OTP_SERVICE_DOWN"
        });
    }
}

module.exports = otpRateLimiter;