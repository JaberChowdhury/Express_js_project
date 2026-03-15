import userRoute from "./routes/users.ts";
import { initDB, pool } from "./config/db.ts";
import { homeRoute } from "./routes/home.ts";
import app from "./app.ts";
import todosRoute from "./routes/todos.ts";
import logger from "./middleware/logger.ts";
import config from "./config/index.ts";

const port = process.env.PORT || 5000;

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

const startServer = async () => {
  try {
    await pool.connect();
    console.log("Database connected");

    await initDB();

    app.listen(port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
