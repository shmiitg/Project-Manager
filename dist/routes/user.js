"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const router = (0, express_1.Router)();
router.get("/", verifyJWT_1.default, (req, res) => {
    try {
        const user = req.user;
        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.default = router;
