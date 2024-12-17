const User = require("../../models/User");
const Wallet = require("../../models/Wallet");

const getUserWallet = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is available in the request

    // Find the wallet associated with the user
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for this user" });
    }

    // Return wallet details including balance and locked balance
    res.status(200).json({
      message: "Wallet fetched successfully",
      wallet: {
        balance: wallet.balance,
        lockedBalance: wallet.lockedBalance,
        transactions: wallet.transactions,
      },
    });
  } catch (error) {
    console.error("Error in getSingleWallet:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateWalletBalance = async (req, res) => {
  const { amount } = req.body; // Get the amount from the request body

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const userId = req.user.id; // Assuming you're getting the user's ID from the request

    // Find the user to make sure they exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the wallet associated with this user
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for this user" });
    }

    // Update the wallet balance by adding the deposit amount
    wallet.balance += parseFloat(amount); // Ensure the amount is a float for accuracy
    wallet.transactions.push({
      amount: parseFloat(amount),
      type: "credit",
      description: "Deposit",
    });

    await wallet.save();

    res.status(200).json({
      message: "Wallet balance updated successfully",
      walletBalance: wallet.balance,
    });
  } catch (error) {
    console.error("Error in updateWalletBalance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changeAmountToLockedBalance = async (req, res) => {
  const { amount } = req.body; // Get the amount from the request body

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const userId = req.user.id; // Assuming you're getting the user's ID from the request

    // Find the user to make sure they exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the wallet associated with this user
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for this user" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update the wallet balance by adding the deposit amount
    wallet.balance -= parseFloat(amount); // Ensure the amount is a float for accuracy
    wallet.lockedBalance += parseFloat(amount);
    wallet.transactions.push({
      amount: parseFloat(amount),
      type: "lock",
      description: "Locked Balance",
    });

    await wallet.save();

    res.status(200).json({
      success: true,
      message: "Wallet balance updated successfully",
      walletBalance: wallet.balance,
      lockedBalance: wallet.lockedBalance,
    });
  } catch (error) {
    console.error("Error in updateWalletBalance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changeAmountToUnlockedBalance = async (req, res) => {
  const { amount } = req.body;
  const { userId } = req.body;
  const { customId } = req.body;
  console.log(userId);
  console.log(amount);

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    // Find the wallet associated with this user
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      if (res) {
        return res.status(404).json({ message: "Wallet not found for this user" });
      } else {
        return { message: "Wallet not found for this user" };
      }
    }

    if (wallet.lockedBalance < amount) {
      if (res) {
        return res.status(400).json({ message: "Insufficient balance" });
      } else {
        return { message: "Insufficient balance" };
      }
    }

    // Update the wallet balance by adding the deposit amount
    wallet.balance += parseFloat(amount); // Ensure the amount is a float for accuracy
    wallet.lockedBalance -= parseFloat(amount);
    wallet.transactions.push({
      amount: parseFloat(amount),
      type: "unlock",
      description: "Unlocked #" + customId,
    });

    await wallet.save();

    const result = {
      success: true,
      message: "Wallet balance updated successfully",
      walletBalance: wallet.balance,
      lockedBalance: wallet.lockedBalance,
    };

    // Nếu gọi từ HTTP, trả về response
    if (res) {
      return res.status(200).json(result);
    } else {
      // Nếu gọi từ Agenda, log kết quả
      return result;
    }
  } catch (error) {
    console.error("Error in updateWalletBalance:", error);
    if (res) return res.status(500).json({ message: "Internal Server Error" });
    else throw error;
  }
};

const payFromRecruiterToCandidate = async (req, res) => {
  const { amount } = req.body;
  const { employerId } = req.body;
  const { applicantId } = req.body;
  const { customId } = req.body;

  console.log(amount);
  console.log(employerId);
  console.log(applicantId);
  console.log(customId);

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    // Find the wallet associated with this user
    const walletFrom = await Wallet.findOne({ userId: employerId });
    if (!walletFrom) {
      return res.status(404).json({ message: "Wallet not found for employer" });
    }

    const walletTo = await Wallet.findOne({ userId: applicantId });
    if (!walletTo) {
      return res
        .status(404)
        .json({ message: "Wallet not found for applicant" });
    }

    if (walletFrom.lockedBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update the wallet balance by adding the deposit amount
    walletFrom.lockedBalance -= parseFloat(amount); // Ensure the amount is a float for accuracy
    walletTo.balance += parseFloat(amount);
    walletFrom.transactions.push({
      amount: parseFloat(amount),
      type: "debit",
      description: "Paid #" + customId,
    });
    walletTo.transactions.push({
      amount: parseFloat(amount),
      type: "credit",
      description: "Received #" + customId,
    });

    await walletFrom.save();
    await walletTo.save();

    res.status(200).json({
      success: true,
      message: "Transaction successfully",
      task: customId,
    });
  } catch (error) {
    console.error("Error in execute transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  updateWalletBalance,
  getUserWallet,
  changeAmountToLockedBalance,
  changeAmountToUnlockedBalance,
  payFromRecruiterToCandidate,
};
