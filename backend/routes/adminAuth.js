import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin";

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "8h" }
    );
    return res.json({ success: true, token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

export default router;
