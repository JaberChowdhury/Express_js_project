import express from "express";
import morgan from "morgan";
import userRoute from "./routes/users.ts";
import { homeRoute } from "./routes/home.ts";
import todosRoute from "./routes/todos.ts";
import logger from "./middleware/logger.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(logger);

app.use("/", homeRoute);
app.use("/api", userRoute);
app.use("/api", todosRoute);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route dont found",
    path: req.path,
  });
});

export default app;
