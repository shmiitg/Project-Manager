import express, { Express } from "express";
import dotenv from "dotenv";
import { User } from "./interface/user.interface";

dotenv.config();

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

import authRouter from "./routes/auth";
import userRouter from "./routes/user";

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => console.log(`Listening on port ${port}..`));
