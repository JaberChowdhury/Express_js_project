import { Router } from "express";
import { type Request, type Response } from "express";
import { pool } from "../config/db.ts";

const todosRoute = Router();

todosRoute.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title, description) VAlUES($1, $2, $3) RETURNING *`,
      [user_id, title, description],
    );
    res.status(201).send({
      success: true,
      message: "Data inserted successfuly",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

todosRoute.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      select * from todos;
      `);
    res.status(200).json({
      success: true,
      message: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
});

todosRoute.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`select * from todos where id = $1`, [
      req.params.id,
    ]);
    res.status(200).json({
      success: result.rows.length !== 0 ? true : false,
      message:
        result.rows.length !== 0
          ? "Todos found successfully"
          : "Todos did not found",
      data: result.rows.length !== 0 ? result.rows[0] : [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
});

todosRoute.put("/todos/:id", async (req: Request, res: Response) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET title=$1, description=$2 WHERE id=$3 RETURNING *`,
      [title, description, req.params.id],
    );
    res.status(200).json({
      success: result.rows.length !== 0 ? true : false,
      message:
        result.rows.length !== 0
          ? "todos updated successfully"
          : "todos did not found",
      data: result.rows.length !== 0 ? result.rows[0] : [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
});

todosRoute.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`delete from todos where id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      res.status(201).json({
        success: false,
        message: "todos did not found",
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "todos deleted sucessfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
});

export default todosRoute;
