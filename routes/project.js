const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/verifyJWT");

router.get("/", authenticateToken, (req, res) => {
    try {
        const id = req.user.id;
        const { name, description } = req.body;
        const findUser = "SELECT * FROM user WHERE id = ?";
        db.query(findUser, [id], (err, data) => {
            if (err) {
                return res.sendStatus(401);
            }
            const ownerId = data[0].id;
            const newProject = "INSERT INTO project (name, description, ownerId) VALUES (?)";
            const values = [name, description, ownerId];
            db.query(newProject, [values], (err, data) => {
                if (err) {
                    return res.status(500).json({ error: "Something went wrong" });
                }
                res.status(201).json(data);
            });
        });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
