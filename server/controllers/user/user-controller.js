// controllers/user/user-controller.js
const User = require("../../models/User");
const cloudinary = require("../../uploads/cloudinary");

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
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Xóa avatar cũ nếu có
    if (user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Tải lên avatar mới
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    // Cập nhật avatar mới vào người dùng
    user.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật avatar thành công!",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserInfo, updateAvatar };
