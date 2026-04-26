const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
    return jwt.sign(
        { userId: user._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "2h" }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}