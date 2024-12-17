const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../uploads/cloudinary");
const User = require("../../models/User");
const Wallet = require("../../models/Wallet");
const { sendEmail } = require("../chat-notification/send-mail-controller");
const Job = require("../../models/Job");
const Task = require("../../models/Task");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const Application = require("../../models/Application");


//register
const registerUser = async (req, res) => {
  const { name, email, avatar, password, role, companyName, address } = req.body;

  try {
    // Kiểm tra email đã tồn tại
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    // Hash mật khẩu
    const hashPassword = await bcrypt.hash(password, 12);

    // Tạo đối tượng người dùng mới
    const newUser = new User({
      name,
      email,
      avatar,
      password: hashPassword,
      role,
      ...(role === "Recruiter" && { companyName, address }), // Thêm trường cho Recruiter
    });

    // Lưu người dùng vào database
    const savedUser = await newUser.save();

    // Tạo ví tự động cho người dùng
    const newWallet = new Wallet({
      userId: savedUser._id,
    });

    await newWallet.save();

    sendEmail(newUser.email, 'Đăng ký tài khoản Gudjob thành công!', 'Chào mừng bạn đến với Gudjob!\n\n Chúng tôi rất vui khi bạn đã đăng ký tài khoản thành công trên hệ thống của chúng tôi.\n\n Vui lòng đăng nhập tiếp tục trải nghiệm dịch vụ.');

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};


//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({ success: false, message: "User does not exists!" });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({ success: false, message: "Incorrect password!" });

    if (checkUser.status === "locked")
      return res.json({ success: false, message: "User is locked!" });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" }).json({
      success: true,
      message: "Logged in succesfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id, 
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured" });
  }
};

//logout
const logoutUser = (req, res) => {
  res
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: 'None' })
    .json({ success: true, message: "Logged out succesfully" });
};

//change password
const changePassword = async (req, res) => {
  const { email } = req.user;
  const { password, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid current password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res
      .clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" })
      .status(200)
      .json({ success: true, message: "Password changed successfully. Please log in again." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

//delete account
const deleteAccount = async (req, res) => {
  const { email } = req.user;
  const { password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid password." });
    }

    const conversations = await Conversation.find({ members: user._id });

    await Message.deleteMany({ conversationId: { $in: conversations.map(c => c._id) } });

    if (user.avatar && user.avatar.public_id) {
      try {
        await cloudinary.uploader.destroy(user.avatar.public_id, {
          resource_type: "image", 
        });
        console.log("Avatar deleted from Cloudinary:", user.avatar.public_id);
      } catch (error) {
        console.error("Error deleting avatar from Cloudinary:", error);
      }
    }

    // Kiểm tra xem người dùng có CV hay không
    if (user.cv && user.cv.length > 0) {
      // Xóa từng CV trên Cloudinary
      await Promise.all(
        user.cv.map(async (cv) => {
          if (cv.public_id) {
            try {
              await cloudinary.uploader.destroy(cv.public_id, {
                resource_type: "raw", // Đảm bảo Cloudinary biết loại file là RAW
              });
              console.log("CV deleted from Cloudinary:", cv.public_id);
            } catch (error) {
              console.error("Error deleting CV from Cloudinary:", error);
            }
          }
        })
      );
      // Sau khi xóa CV trên Cloudinary, xóa mảng CV trong user
      user.cv = [];
      await user.save();
    }

    // Tìm và xóa các dữ liệu liên quan đến người dùng
    await Promise.allSettled([
      User.deleteOne({ email }),
      Wallet.deleteOne({ userId: user._id }),
      Job.deleteMany({ postedBy: user._id }),
      Task.deleteMany({ applicantId: user._id }),
      Task.deleteMany({ employerId: user._id }),
      Conversation.deleteMany({ members: user._id }),
      Application.deleteMany({ "applicantID.user": user._id }),
    ]);

    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" }).status(200).json({ success: true, message: "Account deleted successfully." });

  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const token = jwt.sign({ userId: user._id }, "CLIENT_SECRET_KEY", { expiresIn: "1h" });

    await sendEmail(user.email, "Password Reset", `Click this link to reset your password: ${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`);

    res.status(200).json({ message: "Đã gửi link khôi phục mật khẩu đến email của bạn." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params; // Token từ URL
  const { newPassword } = req.body;

  try {
    // Xác minh token
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    const userId = decoded.userId;

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong cơ sở dữ liệu
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid or expired token." });
  }
};



//authmiddleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized user!" });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ success: false, message: "Unauthorized user!" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, changePassword, forgotPassword, deleteAccount, resetPassword };
