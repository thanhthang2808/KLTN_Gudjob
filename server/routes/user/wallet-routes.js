const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { updateWalletBalance, getUserWallet } = require("../../controllers/user/wallet-controller");
const router = express.Router();

router.get("/get-user-wallet", authMiddleware, getUserWallet)
router.put("/update-wallet-balance", authMiddleware, updateWalletBalance)

module.exports = router;