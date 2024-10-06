import React, { useEffect, useState} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigateTo = useNavigate();

  const handleUserClickHome = () => {
    navigateTo('/candidate/home'); 
  }
  useEffect(() => {
    axios
      .get(`${API_URL}/api/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
        navigateTo("/not-found");
      });
  }, [id, navigateTo]);

  // Định nghĩa các kiểu dáng sử dụng đối tượng JavaScript
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "50px auto",
      padding: "30px",
      background: "linear-gradient(to right, green , rgba(85, 231, 156, 0.8))",
      borderRadius: "15px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      fontFamily: "'Poppins', sans-serif",
      color: "rgba(119, 119, 119, 0.8)",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    headerTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      textShadow: "2px 2px #000",
    },
    banner: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      backgroundColor: "rgba(2, 191, 0, 0.8)",
      padding: "20px",
      borderRadius: "10px",
    },
    infoRow: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "15px",
    },
    infoItem: {
      flex: "1 1 45%",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    label: {
      fontWeight: "600",
      fontSize: "1.1rem",
      color: "#ffeb3b",
    },
    value: {
      fontWeight: "400",
      fontSize: "1rem",
      color: "#ffffff",
    },
    description: {
      marginTop: "25px",
      padding: "15px",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      lineHeight: "1.8",
      color: "#e0f7fa",
    },
    applyButton: {
      display: "block",
      width: "180px",
      padding: "12px 25px",
      backgroundColor: "#22ff57",
      color: "#fff",
      textAlign: "center",
      border: "none",
      borderRadius: "30px",
      textDecoration: "none",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    },
    backButton: {
      display: "block",
      width: "180px",
      padding: "12px 25px",
      backgroundColor: "red",
      color: "#fff",
      textAlign: "center",
      border: "none",
      borderRadius: "30px",
      textDecoration: "none",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    },
    applyButtonHover: {
      backgroundColor: "aqua",
      transform: "translateY(-3px)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    },
    backButtonHover: {
      backgroundColor: "#cd3333",
      transform: "translateY(-3px)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    },
    loading: {
      textAlign: "center",
      fontSize: "1.5rem",
      color: "#ffeb3b",
      padding: "50px 0",
    },
    error: {
      textAlign: "center",
      fontSize: "1.5rem",
      color: "#ff1744",
      padding: "50px 0",
    },
    // Responsive Design
    "@media (maxWidth: 600px)": {
      container: {
        padding: "20px",
      },
      headerTitle: {
        fontSize: "2rem",
      },
      applyButton: {
        width: "100%",
      },
      infoItem: {
        flex: "1 1 100%",
      },
    },
  };

  // Trạng thái Loading
  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Đang tải...</p>
      </div>
    );
  }

  // Trạng thái Lỗi
  if (error || !job) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>
          Không thể tải chi tiết công việc. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <section style={styles.container} className="page">
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>Chi Tiết Tuyển Dụng</h3>
      </div>
      <div style={styles.banner}>
        <div style={styles.infoRow}>
          <div style={styles.infoItem}>
            <span style={styles.label}>📌 Tiêu đề:</span>{" "}
            <span style={styles.value}>{job.title}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>📂 Danh mục:</span>{" "}
            <span style={styles.value}>{job.category}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>🌍 Quốc gia:</span>{" "}
            <span style={styles.value}>{job.country}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>🏙️ Thành phố:</span>{" "}
            <span style={styles.value}>{job.city}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>📍 Vị trí:</span>{" "}
            <span style={styles.value}>{job.location}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>📅 Ngày đăng:</span>{" "}
            <span style={styles.value}>
              {new Date(job.jobPostedOn).toLocaleDateString()}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>💰 Lương:</span>{" "}
            {job.fixedSalary ? (
              <span style={styles.value}>
                {job.fixedSalary.toLocaleString()} VNĐ
              </span>
            ) : (
              <span style={styles.value}>
                {job.salaryFrom.toLocaleString()} VNĐ -{" "}
                {job.salaryTo.toLocaleString()} VNĐ
              </span>
            )}
          </div>
        </div>
        <div style={styles.description}>
          <span style={styles.label}>📝 Mô tả:</span>
          <p>{job.description}</p>
        </div>
        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
        <Link
            to={`/candidate/application/${job._id}`}
            style={styles.applyButton}
            onMouseOver={(e) => {
              Object.assign(e.currentTarget.style, styles.applyButtonHover);
            }}
            onMouseOut={(e) => {
              Object.assign(e.currentTarget.style, styles.applyButton);
            }}
          >
            🚀 Nộp Hồ Sơ
          </Link>
          <button style={styles.backButton}  onMouseOver={(e) => {
              Object.assign(e.currentTarget.style, styles.backButtonHover);
            }}
            onMouseOut={(e) => {
              Object.assign(e.currentTarget.style, styles.backButton);
            }} onClick={handleUserClickHome}>
            ↩ Trở Về
          </button>
        </div>
          
      </div>
    </section>
  );
};

export default JobDetails;
