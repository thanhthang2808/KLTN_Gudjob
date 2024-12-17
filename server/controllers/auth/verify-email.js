const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { sendEmail } = require("../chat-notification/send-mail-controller");


// Secret key cho JWT
const secretKey = "secretKey";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Hàm tạo token xác thực
const generateVerificationToken = (email) => {
    return jwt.sign({ email }, secretKey, { expiresIn: "30m" });
};

// Controller gửi email xác thực
const sendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra nếu email đã được xác thực
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        // Tạo token xác thực
        const token = generateVerificationToken(email);

        // Tạo link xác thực
        const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

        // Gửi email xác thực
        await sendEmail(
            email,
            "Xác thực tài khoản Gudjob",
            `Vui lòng truy cập đường dẫn sau để xác thực tài khoản của bạn (hết hạn sau 30 phút): ${verificationLink}`
        );


        res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
        console.error("Error in sendVerificationEmail:", error);
        res.status(500).json({ message: "Error sending verification email" });
    }
};

// Controller xác thực email
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, secretKey);
        const email = decoded.email;

        // Kiểm tra người dùng trong cơ sở dữ liệu
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra nếu đã xác thực trước đó
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        // Cập nhật trạng thái xác thực
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error in verifyEmail:", error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    sendVerificationEmail,
    verifyEmail,
};
