const express = require('express');
const { registerUser, loginUser, logoutUser, authMiddleware, changePassword, deleteAccount, forgotPassword, resetPassword } = require('../../controllers/auth/auth-controller');
const { sendVerificationEmail, verifyEmail } = require('../../controllers/auth/verify-email');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/change-password', authMiddleware, changePassword);
router.delete('/delete-account', authMiddleware, deleteAccount);
router.get('/check-auth', authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, message : "User is authenticated", user });
});
router.post("/send-verification-email", sendVerificationEmail);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;