import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  pdf,
  Image,
} from "@react-pdf/renderer";
import axios from "axios";
import toast from "react-hot-toast";
import placeholderAvatar from "@/assets/default-user.png"; // Avatar mặc định

import { Font } from "@react-pdf/renderer";
import notoSans from "@/assets/fonts/NotoSans-Regular.ttf"; // Tải font Noto Sans
import { useNavigate } from "react-router-dom";

Font.register({
  family: "Noto Sans",
  src: notoSans,
});

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const UpdateCV = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    education: [],
    experience: [],
    skills: "",
    aboutMe: "",
    avatar: null,
  });

  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/user-info`, {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
        setAvatar(response.data.user.avatar || placeholderAvatar);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserInfo();
  }, []);

  // Tạo kiểu cho PDF
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: "#f8f8f8",
      fontFamily: "Noto Sans", // Áp dụng font Noto Sans
    },
    section: {
      marginBottom: 20,
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#2b6cb0", // Màu xanh nhẹ cho tiêu đề
      marginBottom: 10,
    },
    field: {
      fontSize: 14,
      marginBottom: 8,
      color: "#4a5568", // Màu tối cho thông tin
    },
    label: {
      fontSize: 12,
      color: "#4a5568",
      marginBottom: 5,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      marginBottom: 20,
      border: "3px solid #2b6cb0", // Viền quanh avatar
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#2b6cb0", // Màu xanh nhẹ cho các tiêu đề phụ
      marginBottom: 10,
    },
    contentText: {
      fontSize: 14,
      lineHeight: 1.6,
      color: "#4a5568", // Màu văn bản nhẹ nhàng
    },
    aboutMeSection: {
      marginTop: 20,
      paddingTop: 10,
      borderTop: "1px solid #e2e8f0", // Viền trên cho phần About Me
    },
    contentBox: {
      backgroundColor: "#ffffff", // Nền trắng cho phần nội dung
      padding: 15,
      borderRadius: 8,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
    },
    inputGroup: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    inputField: {
      width: "48%",
      padding: 8,
      border: "1px solid #ccc",
      borderRadius: 5,
    },
    addBtn: {
      marginTop: 10,
      fontSize: 16,
      color: "#3182ce",
      cursor: "pointer",
    },
  });

  // Thay đổi xử lý dữ liệu
const handleAddEducation = () => {
  setUserInfo((prev) => ({
    ...prev,
    education: [...prev.education, ""], // Thêm chuỗi rỗng
  }));
};

const handleChangeEducation = (index, value) => {
  const newEducation = [...userInfo.education];
  newEducation[index] = value; // Cập nhật chuỗi tại index
  setUserInfo((prev) => ({
    ...prev,
    education: newEducation,
  }));
};

const handleAddExperience = () => {
  setUserInfo((prev) => ({
    ...prev,
    experience: [...prev.experience, ""], // Thêm chuỗi rỗng
  }));
};

const handleChangeExperience = (index, value) => {
  const newExperience = [...userInfo.experience];
  newExperience[index] = value; // Cập nhật chuỗi tại index
  setUserInfo((prev) => ({
    ...prev,
    experience: newExperience,
  }));
};


  // Tạo nội dung PDF
  const CVDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image src={avatar?.url || placeholderAvatar} style={styles.avatar} />
          <Text style={styles.header}>{userInfo.name}</Text>
          <Text style={styles.field}>Email: {userInfo.email}</Text>
          <Text style={styles.field}>Phone: {userInfo.phone}</Text>
          <Text style={styles.field}>Address: {userInfo.address}</Text>
        </View>

        {/* Education */}
{userInfo.education.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Education</Text>
    <View style={styles.contentBox}>
      {userInfo.education.map((edu, index) => (
        <Text key={index} style={styles.contentText}>
          {edu}
        </Text>
      ))}
    </View>
  </View>
)}

{/* Experience */}
{userInfo.experience.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Experience</Text>
    <View style={styles.contentBox}>
      {userInfo.experience.map((exp, index) => (
        <Text key={index} style={styles.contentText}>
          {exp}
        </Text>
      ))}
    </View>
  </View>
)}


        {/* Các trường khác */}
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{userInfo.skills}</Text>
        </View>

        <Text style={styles.sectionTitle}>About Me</Text>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{userInfo.aboutMe}</Text>
        </View>
      </Page>
    </Document>
  );

  // Xử lý tải lên Cloudinary
  const handleUploadToCloudinary = async () => {
    const cv = await pdf(<CVDocument />).toBlob();
    const formData = new FormData();
    formData.append("cv", cv);
     

    try {
      const response = await axios.put(
        `${API_URL}/api/user/upload-cv`,
        formData,
        {
            withCredentials: true,
        }
    );

      alert("CV uploaded successfully!");
      console.log("CV:", response.data.cv);
      navigate("/candidate/my-cv");
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to upload CV.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Update CV</h2>
      <form className="space-y-4 max-w-4xl mx-auto">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <img
            src={avatar?.url || placeholderAvatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <input
            type="file"
            onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Các trường nhập liệu */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-700">Phone Number</label>
              <input
                type="text"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Address</label>
            <input
              type="text"
              value={userInfo.address}
              onChange={(e) =>
                setUserInfo({ ...userInfo, address: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Education and Experience */}
        <div className="space-y-4">
        <div>
  <label className="text-sm text-gray-700">Education</label>
  <div className="space-y-4">
    {userInfo.education?.map((edu, index) => (
      <div key={index} className="flex space-x-4">
        <textarea
          value={edu}
          onChange={(e) => handleChangeEducation(index, e.target.value)}
          placeholder="E.g., Bachelor of Science in Computer Science, XYZ University (2015 - 2019)"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    ))}
  </div>
  <button
    type="button"
    onClick={handleAddEducation}
    className="text-blue-500 mt-4"
  >
    + Add Education
  </button>
</div>

{/* Experience */}
<div>
  <label className="text-sm text-gray-700">Experience</label>
  <div className="space-y-4">
    {userInfo.experience?.map((exp, index) => (
      <div key={index} className="flex space-x-4">
        <textarea
          value={exp}
          onChange={(e) => handleChangeExperience(index, e.target.value)}
          placeholder="E.g., Software Developer at ABC Corp (2020 - 2023)"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    ))}
  </div>
  <button
    type="button"
    onClick={handleAddExperience}
    className="text-blue-500 mt-4"
  >
    + Add Experience
  </button>
</div>
        </div>

        {/* Các trường nhập liệu khác */}
        <div>
          <label className="text-sm text-gray-700">Skills</label>
          <textarea
            value={userInfo.skills}
            onChange={(e) =>
              setUserInfo({ ...userInfo, skills: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md h-20"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">About Me</label>
          <textarea
            value={userInfo.aboutMe}
            onChange={(e) =>
              setUserInfo({ ...userInfo, aboutMe: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md h-20"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleUploadToCloudinary}
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload CV to Cloudinary
          </button>
          <PDFDownloadLink
            document={<CVDocument />}
            fileName={`${userInfo.name.replace(" ", "_")}_CV.pdf`}
            className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
          >
            {({ loading }) =>
              loading ? "Preparing document..." : "Download CV as PDF"
            }
          </PDFDownloadLink>
        </div>
      </form>
    </div>
  );
};

export default UpdateCV;
