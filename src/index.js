const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const chatRouter = require("./routers/chat");
const mailRouter = require("./routers/mail");
const verifyRouter = require("./routers/verify");

const dotenv = require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
const port = process.env.PORT;

app.use(express.json());
app.use(chatRouter);
app.use(userRouter);
app.use(mailRouter);
app.use(verifyRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
