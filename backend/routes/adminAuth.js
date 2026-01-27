import express from 'express';

const router = express.Router();

/**
 * TEMP ADMIN LOGIN
 * username: admin
 * password: admin
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    return res.json({ success: true });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});

export default router;
