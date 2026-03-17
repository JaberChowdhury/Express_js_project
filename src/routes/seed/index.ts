import { Router, type Request, type Response } from "express";
import { pool } from "../../config/db.ts";
import { hash } from "bcryptjs";

const SeedRouter = Router();

SeedRouter.post("/reset/db", async (req: Request, res: Response) => {
  try {
    const { users, todos } = req.body;

    // Reset tables
    await pool.query("TRUNCATE TABLE todos RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

    // Insert users
    const insertedUsers = [];
    for (const user of users) {
      const hashedPassword = await hash(user.password as string, 10);
      const result = await pool.query(
        `INSERT INTO users(name, email, password, age, phone, address)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          user.name,
          user.email,
          hashedPassword,
          user.age,
          user.phone,
          user.address,
        ],
      );
      insertedUsers.push(result.rows[0]);
    }

    // Insert todos
    const insertedTodos = [];
    for (const todo of todos) {
      const result = await pool.query(
        `INSERT INTO todos(user_id, title, description, completed, due_date)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          todo.user_id,
          todo.title,
          todo.description,
          todo.completed,
          todo.due_date,
        ],
      );
      insertedTodos.push(result.rows[0]);
    }

    res.status(200).json({
      message: "Database reset successfully",
      users: insertedUsers.length,
      todos: insertedTodos.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset database" });
  }
});
SeedRouter.post("/clean/db", async (req: Request, res: Response) => {
  try {
    await pool.query("TRUNCATE TABLE todos RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

    res.status(200).json({
      message: "Database cleaning successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clean database" });
  }
});

export { SeedRouter };
