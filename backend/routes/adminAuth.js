import express from 'express';

const router = express.Router();

// SIMPLE ADMIN LOGIN (matches your existing frontend)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // change creds if you want
  if (username === 'admin' && password === 'admin') {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, message: 'Invalid login' });
});

export default router;
