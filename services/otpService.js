const { generateOTP } = require("../utils/common/common");
const redisClient = require("../utils/redis/redis");

const otpService = async (email) => {
    const newotp = generateOTP();

    const otpkey = `otp:${email}`;
    const otpexpiry = Number(process.env.OTP_EXPIRY) || 300;
    await redisClient.set(otpkey, JSON.stringify(newotp), { EX: otpexpiry });

    const cooldownkey = `cooldown:${email}`;
    const cooldown = Number(process.env.COOLDOWN) || 60;
    const timer = Date.now() + 60 * 1000
    await redisClient.set(cooldownkey, JSON.stringify(timer), { EX: cooldown });

    const totalOtpskey = `TotalOtps:${email}`;
    const total = await redisClient.incr(totalOtpskey);

    if (total === 1) {
        const one_day = 24 * 60 * 60;
        await redisClient.expire(totalOtpskey, one_day) // 24 hrs limit
    }

    return { timer, newotp };
}

module.exports = otpService;