import { Request, Response, NextFunction } from "express";
import { User } from "../interface/user.interface";
const jwt = require("jsonwebtoken");

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.sendStatus(401);
    }
    const accessToken = process.env.ACCESS_TOKEN_SECRET;
    jwt.verify(token, accessToken, async (err: any, user: User) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

export default authenticateToken;
