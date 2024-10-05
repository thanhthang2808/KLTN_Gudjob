const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
//register
const registerUser = async (req, res) => {
  const { name, email, avatar, password, role, companyName, address } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    // Tạo đối tượng người dùng mới với các trường bổ sung
    const newUser = new User({
      name,
      email,
      avatar,
      password: hashPassword,
      role,
      ...(role === "Recruiter" && { companyName, address }), // Thêm trường companyName và address nếu là Recruiter
    });

    await newUser.save();
    res.status(200).json({ success: true, message: "Registration successful" });
  } catch (e) {
    console.log(e);
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

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "10h" }
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
