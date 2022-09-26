require("dotenv").config();
const express = require("express");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => console.log(`Listening on port ${port}..`));
