const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/verifyJWT");

router.get("/", authenticateToken, (req, res) => {
    try {
        const id = req.user.id;
        const findUser = "SELECT * FROM user WHERE id = ?";
        db.query(findUser, [id], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            res.status(200).json({ id: data[0].id });
        });
    } catch (err) {
        res.sendStatus(500);
    }
});

router.get("/info", authenticateToken, (req, res) => {
    try {
        const id = req.user.id;
        const findUser = "SELECT * FROM user WHERE id = ?";
        db.query(findUser, [id], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            const { password, ...user } = data[0];
            res.status(200).json({ user: user });
        });
    } catch (err) {
        res.sendStatus(500);
    }
});

module.exports = router;
