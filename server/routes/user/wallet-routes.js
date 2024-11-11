const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { updateWalletBalance } = require("../../controllers/user/wallet-controller");
const router = express.Router();

router.put("/update-wallet-balance", authMiddleware, updateWalletBalance)

module.exports = router;