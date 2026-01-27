import express from 'express';

const router = express.Router();

/* LOGIN */
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

/* SIMPLE AUTH CHECK */
router.get('/check', (req, res) => {
  // frontend decides using localStorage
  res.json({ ok: true });
});

export default router;
