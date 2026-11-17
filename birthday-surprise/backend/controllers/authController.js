import dotenv from 'dotenv';
dotenv.config();

export const verifyPassword = (req, res) => {
  const { password } = req.body;
  const targetPassword = process.env.BIRTHDAY_PASSWORD || '181104';

  if (password === targetPassword) {
    return res.status(200).json({
      success: true,
      message: 'Access granted, welcome Universe of Memories!',
      token: 'thi-is-arthi-secret-token-key-2026'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Incorrect password! Hint: 6 digits of your birthday date (DDMMYY).'
  });
};
