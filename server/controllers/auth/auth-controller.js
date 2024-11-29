const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Wallet = require("../../models/Wallet");
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

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
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
    .clearCookie("token")
    .json({ success: true, message: "Logged out succesfully" });
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


module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
