// controllers/user/user-controller.js
const User = require("../../models/User");
const cloudinary = require("../../uploads/cloudinary");
const fs = require("fs").promises;
const Wallet = require("../../models/Wallet");
const Job = require("../../models/Job");
const Task = require("../../models/Task");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const Application = require("../../models/Application");


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

const getMyCV = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user.cv) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ success: true, cv: user.cv });
  } catch (error) {
    console.error("Error in getMyCV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCompanies = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };

    // Điều kiện tìm kiếm (nếu có)
    const searchCondition = search
      ? { companyName: { $regex: search, $options: "i" } } // Tìm kiếm không phân biệt hoa thường
      : {};

    // Tổng số công ty phù hợp
    const totalCompanies = await User.countDocuments({
      role: "Recruiter",
      ...searchCondition,
    });

    // Lấy danh sách công ty và đếm số công việc
    const companies = await User.aggregate([
      { $match: { role: "Recruiter", ...searchCondition } },
      {
        $lookup: {
          from: "jobs", // Collection jobs
          localField: "_id", // ID của công ty
          foreignField: "postedBy", // ID người đăng trong job
          as: "jobs", // Gộp thông tin các công việc vào đây
        },
      },
      {
        $addFields: {
          jobCount: { $size: "$jobs" }, // Đếm số công việc
        },
      },
      {
        $project: {
          password: 0, // Loại bỏ mật khẩu
          jobs: 0, // Không trả về danh sách công việc
        },
      },
      { $skip: options.limit * (options.page - 1) },
      { $limit: options.limit },
    ]);

    res.status(200).json({
      success: true,
      companies,
      totalCompanies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUserAccount = async (req, res) => {
  const { id } = req.body;
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }
    const user = await User.findById({ id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
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



// Cập nhật avatar người dùng
const updateAvatar = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from req.user

    // Check if a file was uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Avatar file required!" });
    }

    const { avatar } = req.files;

    // Validate the file format
    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormats.includes(avatar.mimetype)) {
      return res
        .status(400)
        .json({
          message: "Invalid file type. Please upload a PNG or JPEG file.",
        });
    }

    // Find the user to get the current avatar's public_id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Upload the new avatar to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath
    );

    // Handle potential errors during Cloudinary upload
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return res
        .status(500)
        .json({ message: "Failed to upload avatar to Cloudinary" });
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

const uploadCV = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from req.user
    console.log("Uploaded cv:", req.files);

    // Check if a file was uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "CV file required!" });
    }

    const { cv } = req.files;

    // Validate the file format
    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "docx",
    ];
    if (!allowedFormats.includes(cv.mimetype)) {
      return res.status(400).json({ message: "Invalid file type." });
    }

    // Find the user to get the current avatar's public_id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Upload the new avatar to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader
      .upload(cv.tempFilePath, {
        resource_type: "raw",
      });

    // Handle potential errors during Cloudinary upload
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return res
        .status(500)
        .json({ message: "Failed to upload cv to Cloudinary" });
    }

    // Update user avatar in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          cv: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          },
        },
      },
      { new: true } // Return the updated user
    );

    // Delete the temporary file after upload
    try {
      await fs.unlink(cv.tempFilePath);
      console.log("Temporary file deleted successfully.");
    } catch (err) {
      console.error("Error deleting temporary file:", err);
    }

    // Respond with the updated avatar information
    res.status(200).json({
      success: true,
      message: "CV uploaded successfully!",
      cv: updatedUser.cv,
    });
  } catch (error) {
    console.error("Error in uploadCV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCV = async (req, res) => {
  try {
    const { id } = req.user; // User ID from authentication
    const { cvId } = req.params; // CV ID from request parameters

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Find the CV to delete
    const cvIndex = user.cv.findIndex((cv) => cv._id.toString() === cvId);
    if (cvIndex === -1) {
      return res.status(404).json({ message: "CV not found!" });
    }

    // Delete the CV from Cloudinary
    const cvToDelete = user.cv[cvIndex];
    console.log("CV to delete:", cvToDelete.public_id);
    if (cvToDelete && cvToDelete.public_id) {
      await cloudinary.uploader.destroy(cvToDelete.public_id, {
        resource_type: "raw", // Quan trọng: Đảm bảo Cloudinary biết loại file là RAW
      });
      console.log("CV deleted from Cloudinary.");
    }

    // Remove the CV from the array
    user.cv.splice(cvIndex, 1);

    // Save the user
    await user.save();

    // Respond with the updated CV array
    res.status(200).json({
      success: true,
      message: "CV deleted successfully!",
      cv: user.cv, // Return the updated list of CVs
    });
  } catch (error) {
    console.error("Error in deleteCV:", error);
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
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    console.log("UpdatedUser:", updatedUser);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
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

const updateRecruiterInfo = async (req, res) => {
  try {
    const { id } = req.user; // Lấy ID người dùng từ req.user
    const { name, email, phone, companyName, website, address, numberOfEmployees, industry } = req.body; // Nhận thông tin từ yêu cầu

    // Tạo một đối tượng để lưu thông tin cập nhật
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (companyName) updatedData.companyName = companyName;
    if (website) updatedData.website = website;
    if (address) updatedData.address = address;
    if (numberOfEmployees) updatedData.numberOfEmployees = numberOfEmployees;
    if (industry) updatedData.industry = industry;

    // Cập nhật thông tin người dùng
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    console.log("UpdatedUser:", updatedUser);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      message: "User information updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateRecruiterInfo:", error);
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

const getListCandidate = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: "Candidate" })
      .select("-password")
      .skip(skip)
      .limit(Number(limit));

    const totalCandidates = await User.countDocuments({ role: "Candidate" });

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total: totalCandidates,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCandidates / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getListCompany = async (req, res) => {
  try {
    const users = await User.find({ role: "Recruiter" }).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getListUser = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const lockAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["locked", "active"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.status = status;

    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: `User account ${status} successfully`,
        user,
      });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user account" });
  }
};

const getTotalCandidate = async (req, res) => {
  try {
    const totalCandidate = await User.countDocuments({ role: "Candidate" });

    res.status(200).json({
      success: true,
      totalCandidate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTotalCompany = async (req, res) => {
  try {
    const totalCompany = await User.countDocuments({ role: "Recruiter" });

    res.status(200).json({
      success: true,
      totalCompany,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getUserInfo,
  updateAvatar,
  getSingleUser,
  updateCandidateInfo,
  updateRecruiterInfo,
  getListCandidate,
  getListUser,
  lockAccount,
  uploadCV,
  deleteCV,
  getMyCV,
  getCompanies,
  getListCompany,
  getTotalCandidate,
  getTotalCompany,
  deleteUserAccount
};
