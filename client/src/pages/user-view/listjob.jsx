import React, { useState } from 'react';
import anhmau from '@/assets/anhmau.png';
import heart from '@/assets/heart.svg';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function UserListJob(){
    const navigate = useNavigate();
    const handleUserClickNews = () => {
        navigate('/user/news'); // Thay thế '/profile' bằng đường dẫn trang bạn muốn
    };
    return(
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', // Creates 3 equal columns
            gap: '10px', // Adds spacing between elements
            padding: '30px'
          }}>
            <div style={{backgroundColor:'white', padding:'20px',display:'flex'}}>
                <img src={anhmau} alt="anhmau" className="w-20 h-auto" style={{marginRight:'30px'}} /> 
                <div>
                    <strong  onClick={handleUserClickNews} style={{fontSize:20 ,color:'red',cursor: 'pointer'}}>Nhân viên IT</strong><br></br>
                    <div style={{fontSize:18 ,color:'silver'}}>CÔNG TY TNHH ABC</div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                        <h2 style={{backgroundColor:'#f5f5dc',marginRight:20}}>10-20 Triệu</h2>
                        <h2 style={{backgroundColor:'#f5f5dc',marginRight:20}}>TP HCM</h2>
                        <img src={heart} alt="heart" style={{marginRight:'30px',width:25,height:25}} />
                    </div>
                </div>
            </div>
           
            
        </div>
    )
}
export default UserListJob;