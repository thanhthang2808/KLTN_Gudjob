const User = require("../../models/User");

const updateWalletBalance = async (req, res) => {
  const { amount } = req.body; // Get the amount from the request body

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const userId = req.user.id; // Assuming you're getting the user's ID from the request

    // Find the user and update the wallet balance
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update walletBalance by adding the deposit amount
    user.walletBalance += parseInt(amount); // Ensure the amount is an integer
    await user.save();

    res.status(200).json({ message: "Wallet balance updated successfully", walletBalance: user.walletBalance });
  } catch (error) {
    console.error("Error in updateWalletBalance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { updateWalletBalance };


