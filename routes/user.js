const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/verifyJWT");

router.get("/", authenticateToken, (req, res) => {
    try {
        const user = req.user;
        res.status(201).json({ user });
    } catch (err) {
        res.sendStatus(500);
    }
});

module.exports = router;
