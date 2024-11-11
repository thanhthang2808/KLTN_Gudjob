import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const UpdateCV = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  // Tạo kiểu cho PDF
  const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    header: { fontSize: 24, marginBottom: 10 },
    field: { fontSize: 12, marginBottom: 5 },
  });

  // Tạo nội dung PDF
  const CVDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{name}</Text>
          <Text style={styles.field}>Email: {email}</Text>
          <Text style={styles.field}>Phone: {phone}</Text>
          <Text style={styles.field}>Address: {address}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Education</Text>
          <Text>{education}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Experience</Text>
          <Text>{experience}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Skills</Text>
          <Text>{skills}</Text>
        </View>
      </Page>
    </Document>
  );

  // Xử lý tải lên Cloudinary
  const handleUploadToCloudinary = async () => {
    const blob = await pdf(<CVDocument />).toBlob();
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "your_upload_preset"); // Thay bằng upload preset của Cloudinary

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/your_cloud_name/upload`, // Thay bằng tên tài khoản Cloudinary của bạn
        formData
      );

      toast.success("CV uploaded successfully!");
      console.log("Cloudinary URL:", response.data.secure_url);
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to upload CV.");
    }
  };

  return (
    <div className="container max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Update CV</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <textarea
          placeholder="Education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md h-20"
        />
        <textarea
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md h-20"
        />
        <textarea
          placeholder="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md h-20"
        />
        <button
          type="button"
          onClick={handleUploadToCloudinary}
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload CV to Cloudinary
        </button>
      </form>
      <div className="mt-4">
        <PDFDownloadLink
          document={<CVDocument />}
          fileName={`${name.replace(" ", "_")}_CV.pdf`}
          className="text-blue-600 underline"
        >
          {({ loading }) => (loading ? "Preparing document..." : "Download CV as PDF")}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default UpdateCV;
