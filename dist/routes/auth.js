"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jwt = require("jsonwebtoken");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10000s" });
};
//register user
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, institute, email, password } = req.body;
        //check if email exists
        let user = yield prisma.user.findUnique({ where: { email: email } });
        if (user) {
            return res.status(500).json({ error: "Email already taken" });
        }
        //create new user
        user = yield prisma.user.create({
            data: { name: name, institute: institute, email: email, password: password },
        });
        const accessToken = generateAccessToken(user);
        res.status(201).json({ accessToken: accessToken });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}));
// login user
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //Status code 400 -> Bad Request
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = yield prisma.user.findUnique({ where: { email: email } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const accessToken = generateAccessToken(user);
        res.status(201).json({ accessToken: accessToken });
    }
    catch (err) {
        res.sendStatus(500);
    }
}));
exports.default = router;
