import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

export default router;
