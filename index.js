require("dotenv").config();
const express = require("express");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const projectRouter = require("./routes/project");
const taskRouter = require("./routes/task");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use("/api/task", taskRouter);

app.listen(port, () => console.log(`Listening on port ${port}..`));
