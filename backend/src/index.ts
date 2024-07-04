import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import communityRouter from "./routes/community.routes";
import serverStatusRouter from "./routes/serverStatus.routes";
import postRouter from "./routes/post.routes";
import commentRouter from "./routes/comment.routes";

import { corsOptions } from "./config/corsOption";
import { credentials } from "./middlewares/credentials.middleware";
import { connectDb } from "./config/db";
import { verifyJwt } from "./middlewares/auth.middleware";
import { handleErrors } from "./middlewares/error.middleware";

// Don't change the order //
connectDb();
const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/server-status", serverStatusRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/community", verifyJwt, communityRouter);
app.use("/api/post", verifyJwt, postRouter);
app.use("/api/comment", verifyJwt, commentRouter);

app.use(handleErrors);

const port = process.env.SERVER_PORT || 3456;
app.listen(port, () => {
  console.log("Connected on port:", port);
});
