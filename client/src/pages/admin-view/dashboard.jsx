import React from 'react';
import {
  Users,
  Briefcase,
  FileText,
  PieChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const styles = {
    main: {
      flex: 1,
      backgroundColor: '#f0f2f5',
      padding: '30px',
      fontFamily: "'Poppins', sans-serif",
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    headerTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#333',
      textShadow: '1px 1px #fff',
    },
    headerProfile: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    profileImage: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '15px',
      border: '2px solid #ff5722',
    },
    statsContainer: {
      display: 'flex',
      gap: '25px',
      marginBottom: '40px',
      flexWrap: 'wrap',
    },
    statCard: {
      flex: '1',
      minWidth: '220px',
      backgroundColor: '#fff',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
    },
    statIcon: {
      fontSize: '3rem',
      marginRight: '20px',
      color: '#ff5722',
    },
    statInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#333',
    },
    statLabel: {
      fontSize: '1.2rem',
      color: '#777',
    },
    recentSection: {
      backgroundColor: '#fff',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    },
    recentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
    },
    recentTitle: {
      fontSize: '1.8rem',
      color: '#333',
    },
    viewAll: {
      color: '#ff5722',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '1rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      backgroundColor: '#ff5722',
      color: '#fff',
      borderRadius: '8px 8px 0 0',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      color: '#555',
    },
    rowHover: {
      backgroundColor: '#f1f1f1',
    },
  };

  // Mock dữ liệu thống kê
  const stats = [
    {
      id: 1,
      label: 'Tổng Công Việc',
      value: 120,
      icon: <Briefcase style={styles.statIcon} />,
    },
    {
      id: 2,
      label: 'Tổng Người Dùng',
      value: 450,
      icon: <Users style={styles.statIcon} />,
    },
    {
      id: 3,
      label: 'Hồ Sơ Ứng Tuyển',
      value: 320,
      icon: <FileText style={styles.statIcon} />,
    },
    {
      id: 4,
      label: 'Thống Kê',
      value: 8,
      icon: <PieChart style={styles.statIcon} />,
    },
  ];

  // Mock dữ liệu hồ sơ ứng tuyển gần đây
  const recentApplications = [
    {
      id: 1,
      applicant: 'Nguyễn Văn A',
      job: 'Nhân viên Marketing',
      date: '2024-04-25',
    },
    {
      id: 2,
      applicant: 'Trần Thị B',
      job: 'Lập trình viên Frontend',
      date: '2024-04-24',
    },
    {
      id: 3,
      applicant: 'Lê Văn C',
      job: 'Quản lý Dự án',
      date: '2024-04-23',
    },
    {
      id: 4,
      applicant: 'Phạm Thị D',
      job: 'Chuyên viên Kinh doanh',
      date: '2024-04-22',
    },
  ];

  return (
    <div style={styles.main}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>🎯 Bảng Điều Khiển Quản Trị</h1>
        <div style={styles.headerProfile}>
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            style={styles.profileImage}
          />
          <span style={{ color: '#333', fontWeight: '600' }}>Admin</span>
        </div>
      </div>

      {/* Thống Kê */}
      <div style={styles.statsContainer}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            style={styles.statCard}
            onMouseOver={(e) =>
              Object.assign(e.currentTarget.style, styles.statCardHover)
            }
            onMouseOut={(e) =>
              Object.assign(e.currentTarget.style, {
                transform: 'translateY(0)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
              })
            }
          >
            {stat.icon}
            <div style={styles.statInfo}>
              <span style={styles.statNumber}>{stat.value}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hồ Sơ Ứng Tuyển Gần Đây */}
      <div style={styles.recentSection}>
        <div style={styles.recentHeader}>
          <h2 style={styles.recentTitle}>📄 Hồ Sơ Ứng Tuyển Gần Đây</h2>
          <Link to="/admin/applications" style={styles.viewAll}>
            Xem Tất Cả
          </Link>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Người Ứng Tuyển</th>
              <th style={styles.th}>Vị Trí</th>
              <th style={styles.th}>Ngày Ứng Tuyển</th>
            </tr>
          </thead>
          <tbody>
            {recentApplications.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>{app.applicant}</td>
                <td style={styles.td}>{app.job}</td>
                <td style={styles.td}>{app.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
