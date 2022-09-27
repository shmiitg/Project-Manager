const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const generateAccessToken = (id) => {
    return jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10000s" });
};

//register user
router.post("/register", async (req, res) => {
    try {
        const { name, institute, email, password } = req.body;
        //check if email exists
        const emailCheck = "SELECT * FROM user WHERE email = ?";
        db.query(emailCheck, [email], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            if (data.length) {
                return res.status(409).json({ error: "Email already taken" });
            }
            //create new user
            const newUser =
                "INSERT INTO user (`name`, `email`, `password`, `institute`) VALUES (?)";
            const values = [name, email, password, institute];
            db.query(newUser, [values], (err, data) => {
                if (err) {
                    return res.status(500).json({ error: "Something went wrong" });
                }
                const accessToken = generateAccessToken(email);
                return res.status(201).json({ accessToken: accessToken });
            });
        });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});

// login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailCheck = "SELECT * FROM user WHERE email = ?";
        db.query(emailCheck, [email], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            if (data.length === 0 || data[0].password !== password) {
                res.status(404).json({ error: "User not found" });
            } else {
                const accessToken = generateAccessToken(data[0].id);
                res.status(200).json({ accessToken: accessToken });
            }
        });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
