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
    const { id } = req.user; // Giả sử người dùng đã đăng nhập và thông tin user có sẵn
    console.log("avatar:", req.files);
    
    // Kiểm tra nếu không có file được tải lên
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Avatar file required!" });
    }

    const { avatar } = req.files;

    // Các định dạng file được phép (có thể bao gồm ảnh)
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormats.includes(avatar.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Please upload a PNG or JPEG file." });
    }

    // Upload avatar lên Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);

    // Xử lý lỗi khi upload lên Cloudinary
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return res.status(500).json({ message: "Failed to upload avatar to Cloudinary" });
    }

    // Cập nhật avatar trong cơ sở dữ liệu cho user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        avatar: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      },
      { new: true } // Trả về user đã được cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateAvatar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { getUserInfo, updateAvatar };
