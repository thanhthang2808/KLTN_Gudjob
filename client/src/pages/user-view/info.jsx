import React, { useState } from 'react';

function Info() {
  // Dữ liệu người dùng, có thể lấy từ props, context hoặc API
  const initialUser = {
    username: 'tuankietbmy',
    password: '********', // Không nên hiển thị mật khẩu thực tế
    fullName: 'Trương Kiệt',
    phoneNumber: '0333333333',
  };

  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFullName, setEditedFullName] = useState(user.fullName);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(user.phoneNumber);

  // Trạng thái đổi mật khẩu
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Hàm xử lý các nút chức năng
  const handleUpdateInfo = () => {
    setIsEditing(true);
  };

  const handleUpgradeAccount = () => {
    // Logic để nâng cấp tài khoản
    console.log('Nâng cấp tài khoản');
    // Ví dụ: điều hướng đến trang nâng cấp tài khoản
  };

  const handleChangePassword = () => {
    setIsEditingPassword(true);
  };

  const handleSave = () => {
    // Cập nhật thông tin người dùng
    setUser({
      ...user,
      fullName: editedFullName,
      phoneNumber: editedPhoneNumber,
    });
    setIsEditing(false);
    console.log('Thông tin đã được lưu:', {
      fullName: editedFullName,
      phoneNumber: editedPhoneNumber,
    });
    // Bạn có thể thêm logic gọi API để lưu thông tin lên server
  };

  const handleCancel = () => {
    // Hủy bỏ chỉnh sửa và quay lại thông tin ban đầu
    setEditedFullName(user.fullName);
    setEditedPhoneNumber(user.phoneNumber);
    setIsEditing(false);
  };

  const handleSavePassword = () => {
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
    if (newPassword !== confirmNewPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu mới không khớp.');
      return;
    }

    if (currentPassword !== user.password && user.password !== '********') {
      // Trong thực tế, bạn sẽ kiểm tra mật khẩu hiện tại thông qua API
      alert('Mật khẩu hiện tại không đúng.');
      return;
    }

    // Cập nhật mật khẩu
    setUser({
      ...user,
      password: '********', // Bạn không nên lưu mật khẩu trực tiếp
    });
    setIsEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    console.log('Mật khẩu đã được thay đổi.');
    // Thêm logic gọi API để cập nhật mật khẩu trên server
  };

  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="container">
      <div className="content">
        {/* Phần hiển thị thông tin tài khoản */}
        <div className="infoSection">
          <h1>Thông Tin Tài Khoản</h1>
          <div className="infoItem">
            <strong>Tên đăng nhập:</strong> {user.username}
          </div>
          <div className="infoItem">
            <strong>Mật khẩu:</strong> {user.password}
          </div>
          <div className="infoItem">
            <strong>Họ và tên:</strong>{' '}
            {isEditing ? (
              <input
                type="text"
                value={editedFullName}
                onChange={(e) => setEditedFullName(e.target.value)}
                className="inputField"
              />
            ) : (
              user.fullName
            )}
          </div>
          <div className="infoItem">
            <strong>Số điện thoại:</strong>{' '}
            {isEditing ? (
              <input
                type="text"
                value={editedPhoneNumber}
                onChange={(e) => setEditedPhoneNumber(e.target.value)}
                className="inputField"
              />
            ) : (
              user.phoneNumber
            )}
          </div>
          {isEditing && (
            <div className="buttonGroup">
              <button className="button saveButton" onClick={handleSave}>
                Lưu
              </button>
              <button className="button cancelButton" onClick={handleCancel}>
                Hủy
              </button>
            </div>
          )}
        </div>

        {/* Phần các mục chức năng */}
        <div className="functionSection">
          <h1>Chức Năng</h1>
          <ul className="functionList">
            <li>
              <button
                className="functionButton updateButton"
                onClick={handleUpdateInfo}
                disabled={isEditing || isEditingPassword} // Vô hiệu hóa nút khi đang chỉnh sửa
              >
                Cập nhật thông tin cá nhân
              </button>
            </li>
            <li>
              <button
                className="functionButton upgradeButton"
                onClick={handleUpgradeAccount}
              >
                Nâng cấp tài khoản
              </button>
            </li>
            <li>
              <button
                className="functionButton changePasswordButton"
                onClick={handleChangePassword}
                disabled={isEditing || isEditingPassword} // Vô hiệu hóa nút khi đang chỉnh sửa
              >
                Đổi mật khẩu
              </button>
            </li>
          </ul>

          {/* Phần đổi mật khẩu */}
          {isEditingPassword && (
            <div className="passwordSection">
              <h2>Đổi Mật Khẩu</h2>
              <div className="passwordField">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="passwordField">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="passwordField">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <div className="buttonGroup">
                <button className="button saveButton" onClick={handleSavePassword}>
                  Lưu
                </button>
                <button className="button cancelButton" onClick={handleCancelPassword}>
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS tích hợp trực tiếp */}
      <style>
        {`
          /* styles.css */

          /* Cài đặt chung cho toàn bộ ứng dụng */
          .container {
            height: 80vh;
            overflow-y: auto;
            flex: 1;
            padding: 20px;
            box-sizing: border-box;
            background: linear-gradient(135deg, #ece9e6, #ffffff);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          /* Bố cục nội dung */
          .content {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
          }

          /* Phần thông tin tài khoản */
          .infoSection {
            flex: 1;
            min-width: 300px;
            padding: 30px;
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .infoSection h1 {
            margin-bottom: 30px;
            font-size: 28px;
            color: #2c3e50;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 10px;
          }

          .infoItem {
            margin-bottom: 20px;
            font-size: 18px;
          }

          .infoItem strong {
            color: #34495e;
          }

          /* Trường nhập liệu */
          .inputField {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 2px solid #bdc3c7;
            border-radius: 5px;
            transition: border-color 0.3s;
          }

          .inputField:focus {
            border-color: #3498db;
            outline: none;
          }

          /* Nhóm nút */
          .buttonGroup {
            margin-top: 20px;
          }

          .button {
            padding: 12px 25px;
            margin-right: 10px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s, opacity 0.2s;
          }

          .button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
          }

          .saveButton {
            background-color: #27ae60;
            color: #ffffff;
          }

          .cancelButton {
            background-color: #c0392b;
            color: #ffffff;
          }

          /* Phần chức năng */
          .functionSection {
            flex: 1;
            min-width: 300px;
            padding: 30px;
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .functionSection h1 {
            margin-bottom: 30px;
            font-size: 28px;
            color: #2980b9;
            border-bottom: 2px solid #2980b9;
            padding-bottom: 10px;
          }

          .functionList {
            list-style: none;
            padding: 0;
          }

          .functionList li {
            margin-bottom: 20px;
          }

          .functionButton {
            width: 100%;
            padding: 15px;
            font-size: 16px;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: transform 0.2s, opacity 0.2s;
          }

          .functionButton:hover {
            transform: translateY(-2px);
            opacity: 0.9;
          }

          .updateButton {
            background-color: #1abc9c;
          }

          .upgradeButton {
            background-color: #8e44ad;
          }

          .changePasswordButton {
            background-color: #e74c3c;
          }

          /* Phần đổi mật khẩu */
          .passwordSection {
            margin-top: 30px;
            padding: 20px;
            border-radius: 10px;
            background-color: #f8f9fa;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .passwordSection h2 {
            margin-bottom: 20px;
            color: #2c3e50;
          }

          .passwordField {
            margin-bottom: 15px;
          }

          .passwordField label {
            display: block;
            margin-bottom: 5px;
            color: #34495e;
          }

          .passwordField input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 2px solid #bdc3c7;
            border-radius: 5px;
            transition: border-color 0.3s;
          }

          .passwordField input:focus {
            border-color: #3498db;
            outline: none;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .content {
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Info;
