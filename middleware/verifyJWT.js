const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    const accessToken = process.env.ACCESS_TOKEN_SECRET;
    jwt.verify(token, accessToken, async (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
