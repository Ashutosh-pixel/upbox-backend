const jwt = require("jsonwebtoken");

const apiAuth = (req, res, next) => {
    let token;

    const header = req.headers.authorization;

    if (header) {
        token = header.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};

module.exports = apiAuth