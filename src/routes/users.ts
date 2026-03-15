import { Router } from "express";
import { type Request, type Response } from "express";
import { pool } from "../config/db.ts";

const userRoute = Router();

userRoute.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name, email, age, phone, address) VAlUES($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, age, phone, address],
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

userRoute.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      select * from users;
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

userRoute.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`select * from users where id = $1`, [
      req.params.id,
    ]);
    res.status(200).json({
      success: result.rows.length !== 0 ? true : false,
      message:
        result.rows.length !== 0
          ? "User found successfully"
          : "User did not found",
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

userRoute.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id],
    );
    res.status(200).json({
      success: result.rows.length !== 0 ? true : false,
      message:
        result.rows.length !== 0
          ? "User updated successfully"
          : "User did not found",
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

userRoute.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`delete from users where id = $1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      res.status(201).json({
        success: false,
        message: "User did not found",
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted sucessfully",
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

export default userRoute;
