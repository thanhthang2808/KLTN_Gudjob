// controllers/user/user-controller.js
const User = require("../../models/User");
const cloudinary = require("../../uploads/cloudinary");
const fs = require("fs").promises;

// Lấy thông tin người dùng
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// Cập nhật avatar người dùng
const updateAvatar = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from req.user
    console.log("Uploaded avatar:", req.files);

    // Check if a file was uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Avatar file required!" });
    }

    const { avatar } = req.files;

    // Validate the file format
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormats.includes(avatar.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Please upload a PNG or JPEG file." });
    }

    // Find the user to get the current avatar's public_id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Upload the new avatar to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);

    // Handle potential errors during Cloudinary upload
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return res.status(500).json({ message: "Failed to upload avatar to Cloudinary" });
    }

    // Delete the old avatar from Cloudinary if it exists
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
      console.log("Previous avatar deleted from Cloudinary.");
    }

    // Update user avatar in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        avatar: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      },
      { new: true } // Return the updated user
    );

    // Delete the temporary file after upload
    try {
      await fs.unlink(avatar.tempFilePath);
      console.log("Temporary file deleted successfully.");
    } catch (err) {
      console.error("Error deleting temporary file:", err);
    }

    // Respond with the updated avatar information
    res.status(200).json({
      success: true,
      message: "Avatar updated successfully!",
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("Error in updateAvatar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCandidateInfo = async (req, res) => {
  try {
    const { id } = req.user; // Lấy ID người dùng từ req.user
    const { name, email, phone, skills } = req.body; // Nhận thông tin từ yêu cầu

    // Tạo một đối tượng để lưu thông tin cập nhật
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (skills) updatedData.skills = skills;

    // Cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    console.log("UpdatedUser:", updatedUser);
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      message: "User information updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateInfo:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: `Invalid ID / CastError` });
  }
};

module.exports = { getUserInfo, updateAvatar, getSingleUser, updateCandidateInfo };
