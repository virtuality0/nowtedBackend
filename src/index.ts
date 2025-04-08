import express from "express";
import env from "dotenv";
import { userRouter } from "./routes/user";
env.config();

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);

app.get("/", (_, res) => {
  res.json({
    msg: "Application running.",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Application running on port ${process.env.PORT}`);
});
