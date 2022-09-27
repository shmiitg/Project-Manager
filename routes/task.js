const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/verifyJWT");

router.get("/:projectId", authenticateToken, (req, res) => {
    try {
        const { name, state } = req.body;
        const projectId = "...";
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
