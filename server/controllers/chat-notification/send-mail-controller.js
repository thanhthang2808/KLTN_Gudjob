const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.GMAIL_AUTH, // generated ethereal user
    pass: process.env.KEY_GMAIL_SECRET, // generated ethereal password
  },
});
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: { name: "Gudjob Vietnam", address: "testingmtt2808@gmail.com" }, // Địa chỉ email gửi
    to: to, // Địa chỉ email người nhận
    subject: subject, // Tiêu đề email
    text: text // Nội dung email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendEmail };
