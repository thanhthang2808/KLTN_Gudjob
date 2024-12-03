const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { updateWalletBalance, getUserWallet, changeAmountToLockedBalance } = require("../../controllers/user/wallet-controller");
const router = express.Router();

router.get("/get-user-wallet", authMiddleware, getUserWallet)
router.put("/update-wallet-balance", authMiddleware, updateWalletBalance)
router.put("/lock-wallet-balance", authMiddleware, changeAmountToLockedBalance)

module.exports = router;