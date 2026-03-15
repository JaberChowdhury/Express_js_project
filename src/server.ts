import app from "./app.ts";
import { initDB, pool } from "./config/db.ts";
import config from "./config/index.ts";

const startServer = async () => {
  try {
    await pool.connect();
    console.log("Database connected");

    await initDB();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
