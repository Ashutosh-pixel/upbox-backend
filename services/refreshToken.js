const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/token");
const RefreshToken = require("../models/RefreshToken");

const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.sendStatus(401);

    try {
        const decode = jwt.verify(token, process.env.REFRESH_SECRET);

        const exists = await RefreshToken.findOne({ token });
        if (!exists) return res.sendStatus(403);

        const accessToken = generateAccessToken({ _id: decode.userId });

        return res.json({ accessToken });
    } catch (error) {
        console.log("error", error)
        return res.sendStatus(403);
    }
}

module.exports = refresh;