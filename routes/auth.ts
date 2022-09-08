import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../interface/user.interface";
const jwt = require("jsonwebtoken");
const router: Router = Router();
const prisma = new PrismaClient();

const generateAccessToken = (user: User) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10000s" });
};

//register user
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, institute, email, password } = req.body;
        //check if email exists
        let user = await prisma.user.findUnique({ where: { email: email } });
        if (user) {
            return res.status(500).json({ error: "Email already taken" });
        }
        //create new user
        user = await prisma.user.create({
            data: { name: name, institute: institute, email: email, password: password },
        });
        const accessToken = generateAccessToken(user);
        res.status(201).json({ accessToken: accessToken });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// login user
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        //Status code 400 -> Bad Request
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const accessToken = generateAccessToken(user);
        res.status(201).json({ accessToken: accessToken });
    } catch (err) {
        res.sendStatus(500);
    }
});

export default router;
