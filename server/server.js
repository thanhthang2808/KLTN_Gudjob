const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');
const authRoutes = require("./routes/auth/auth-routes");
const userRoutes = require("./routes/user/user-routes");
const jobRoutes = require("./routes/job/job-routes");
const applicationRoutes = require("./routes/job/application-routes");

dotenv.config();

mongoose
  .connect(
    'mongodb+srv://testingmtt2808:thanhthang@cluster0.ziuc9.mongodb.net/'
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
