const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const generateAccessToken = (email) => {
    return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10000s" });
};

//register user
router.post("/register", async (req, res) => {
    try {
        const { name, institute, email, password } = req.body;
        //check if email exists
        const emailCheck = "SELECT * FROM user WHERE email = ?";
        db.query(emailCheck, [email], (err, data) => {
            if (err) return res.sendStatus(401);
            if (data.length) {
                res.status(500).json({ error: "Email already taken" });
            } else {
                //create new user
                const newUser =
                    "INSERT INTO user (`name`, `email`, `password`, `institute`) VALUES (?)";
                const values = [name, email, password, institute];
                db.query(newUser, [values], (err, data) => {
                    if (err) return res.sendStatus(500);
                    const accessToken = generateAccessToken(email);
                    res.status(201).json({ accessToken: accessToken });
                });
            }
        });
    } catch (err) {
        res.sendStatus(500);
    }
});

// login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        //Status code 400 -> Bad Request
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const emailCheck = "SELECT * FROM user WHERE email = ?";
        db.query(emailCheck, [email], (err, data) => {
            if (err) return res.sendStatus(401);
            if (data.length === 0 || data[0].password !== password) {
                res.status(401).json({ error: "Invalid email or password" });
            } else {
                const accessToken = generateAccessToken(email);
                res.status(201).json({ accessToken: accessToken });
            }
        });
    } catch (err) {
        res.sendStatus(500);
    }
});

module.exports = router;
