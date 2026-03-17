import { compare } from "bcryptjs";
import { pool } from "../../config/db.ts";
import jwt from "jsonwebtoken";
import config from "../../config/index.ts";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  const user = await result.rows[0];
  const match = compare(password, user.password);
  if (!match) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, email: user.email },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    },
  );

  console.log({ token });
  return { token, user };
};

export const authService = { loginUser };
