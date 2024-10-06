import React from 'react';
import { Text } from 'lucide-react';
function AdminManager() {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>

        {/* User Management Section */}
        <div style={{ textAlign: 'center', width: '30%', border: '1px solid black', borderRadius: '5px', padding: '10px' }}>
          <Text/>
          <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '10px' ,borderBottomWidth:'3px',paddingBottom:'20px'}}>
            Quản lý tài khoản người dùng
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver'}}>
              Xem danh sách tài khoản người dùng
            </button>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver' }}>
              Thêm, xóa, sửa tài khoản người dùng
            </button>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver' }}>
              Khóa tài khoản người dùng
            </button>
          </div>
        </div>

        {/* System Management Section */}
        <div style={{ textAlign: 'center', width: '30%', border: '1px solid black', borderRadius: '5px', padding: '10px' }}>
          <Text/>
          <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '10px',borderBottomWidth:'3px',paddingBottom:'20px' }}>
            Quản lý hệ thống
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver' }}>
              Xem báo cáo thống kê
            </button>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver' }}>
              Xem báo cáo vi phạm
            </button>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver' }}>
              Sao lưu dữ liệu
            </button>
          </div>
        </div>

        {/* Post Management Section */}
        <div style={{ textAlign: 'center', width: '30%', border: '1px solid black', borderRadius: '5px', padding: '10px' }}>
          <Text/>
          <div style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '10px',borderBottomWidth:'3px',paddingBottom:'20px' }}>
            Quản lý bài đăng
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver'}}>
              Duyệt bài đăng
            </button>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver' }}>
              Xem danh sách bài đăng
            </button>
            <button style={{ margin: '20px', padding: '10px', width: '80%',height:'60px' ,backgroundColor:'silver' }}>
              Xóa bài đăng
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
export default AdminManager;