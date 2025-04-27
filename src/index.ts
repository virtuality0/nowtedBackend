import express from "express";
import env from "dotenv";
import { userRouter } from "./routes/user";
import cors from "cors";
import { folderRouter } from "./routes/folder";
import cookieParser from "cookie-parser";
import { noteRouter } from "./routes/note";

env.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FE_URL ?? "",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/folder", folderRouter);
app.use("/api/v1/note", noteRouter);

app.get("/", (_, res) => {
  res.json({
    msg: "Application running.",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Application running on port ${process.env.PORT}`);
});
