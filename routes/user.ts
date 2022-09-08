import { Router, Request, Response } from "express";
import authenticateToken from "../middleware/verifyJWT";
const router: Router = Router();

router.get("/", authenticateToken, (req: Request, res: Response) => {
    try {
        const user = req.user;
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});

export default router;
