import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CandidateSearch from './search';
import CandidateJobList from './joblist';
import money from '@/assets/money.svg';
import location from '@/assets/location.svg';
import experience from '@/assets/experience.svg';
import time from '@/assets/time.svg';
import share from '@/assets/share.svg';
import anhmau from '@/assets/anhmau.png';
import heartgreen from '@/assets/heartgreen.svg';
import bell from '@/assets/bell.svg';
import level from '@/assets/level.svg';
import numberpeople from '@/assets/numberpeople.svg';
import job from '@/assets/job.svg';
import gender from '@/assets/gender.svg';

function CandidateNews() {
  return (
    <div style={{ height: '80vh', overflowY: 'auto',flex:1 }}>
        {/* Header */}
          <CandidateSearch />
          <div style={{ display: 'flex', height: 'auto' }}>
            {/* Bên trái chiếm 60% */}
            <div style={{ flex: 6.5, padding: '20px', marginRight:'5px'}}>
              <div style={{backgroundColor:'white',padding:'20px'}}>
                <div style={{fontSize:25,fontWeight:'bold',marginBottom:'30px'}}>Nhân Viên ABCD Thu Nhập Từ 10.000.000 VND</div>
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',padding:'30px'}}>
                  <div style={{display:'flex',flexDirection:'row'}}>
                    <img src={money} alt="money" className="w-20 h-auto" style={{margin:'10px',width:50,height:50}} /> 
                    <div style={{alignContent:'center'}}>
                      <h2>Mức lương</h2>
                      <strong>Trên 10.000.000 VND</strong>
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'row'}}>
                    <img src={location} alt="location" className="w-20 h-auto" style={{margin:'10px',width:50,height:50}} /> 
                    <div style={{alignContent:'center'}}>
                      <h2>Địa điểm</h2>
                      <strong>TP HCM</strong>
                    </div>
                  </div>
                  <div style={{display:'flex',flexDirection:'row'}}>
                    <img src={experience} alt="experience" className="w-20 h-auto" style={{margin:'10px',width:50,height:50}} /> 
                    <div style={{alignContent:'center'}}>
                      <h2>Kinh nghiệm</h2>
                      <strong>Không yêu cầu kinh nghiệm</strong>
                    </div>
                  </div>
                </div>
                <div style={{backgroundColor:'silver',margin:'30px',display:'flex',flexDirection:'row',width:'30%'}}> 
                  <img src={time} alt="time" className="w-20 h-auto" style={{margin:'10px',width:20,height:20}} />
                  <div style={{alignSelf:'center',color:'gray'}}>Hạn nộp hồ sơ: 12/12/2024</div>
                </div>
                <div style={{display:'flex',flexDirection:'row',paddingRight:'30px'}}>
                  <div style={{padding:'5px',marginLeft:'30px',width:'70%',display:'flex',flexDirection:'row',justifyContent:'center',backgroundColor:'green'}}>
                    <img src={share} alt="share" className="w-20 h-auto" style={{margin:'10px',width:30,height:30}} />
                    <div style={{alignSelf:'center',color:'white',fontSize:20,fontWeight:'bold'}}>Ứng tuyển ngay</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'row',justifyContent:'center',borderWidth:'1px',borderColor:'green',width:'20%',marginLeft:'auto'}}>
                    <img src={heartgreen} alt="heartgreen" className="w-20 h-auto" style={{margin:'10px',width:30,height:30,alignSelf:'center'}} />
                    <div style={{color:'green',fontSize:20,alignSelf:'center',fontWeight:'bold'}}>Lưu tin</div>
                  </div>
                </div>
              </div>

              <div style={{backgroundColor:'white',padding:'20px',marginTop:'30px'}}>
                <div style={{display:'flex',flexDirection:'row',padding:'30px'}}>
                  <div style={{backgroundColor:'green',width:'10px',height:'auto'}}></div>
                  <div style={{fontSize:25,fontWeight:'bold',marginLeft:'10px',alignSelf:'center'}}>Chi tiết tin tuyển dụng</div>
                  <div style={{marginLeft:'auto',padding:'5px',borderWidth:'1px',borderColor:'green',display:'flex',flexDirection:'row'}}>
                    <img src={bell} alt="bell" className="w-20 h-auto" style={{margin:'10px',width:30,height:30,alignSelf:'center'}} />
                    <div style={{fontSize:20,color:'green',alignSelf:'center'}}>Gửi tôi việc làm tương tự</div>
                  </div>
                </div>
                <div style={{fontSize:20,fontWeight:'bold',margin:'30px'}}>
                  Mô tả công việc
                </div>
                <p  style={{marginLeft:'30px'}}>- Tập hợp, rà soát, kiểm tra tính hợp lý hợp lệ , đối chiếu hóa đơn chứng từ kế toán của Công ty để theo dõi và hạch toán trên phần mềm;</p>
                <div style={{fontSize:20,fontWeight:'bold',margin:'30px'}}>
                  Yêu cầu ứng viên
                </div>
                <p  style={{marginLeft:'30px'}}>- Chăm chỉ, cẩn thận</p>
                <div style={{fontSize:20,fontWeight:'bold',margin:'30px'}}>
                  Quyền lợi
                </div>
                <p  style={{marginLeft:'30px'}}>- Hưởng nguyên lương trong thời gian thử việc.</p>
                <div style={{fontSize:20,fontWeight:'bold',margin:'30px'}}>
                  Địa điểm làm việc
                </div>
                <p  style={{marginLeft:'30px'}}>- TP HCM: 03 Nguyễn Văn Bảo, Gò Vấp</p>
                <div style={{fontSize:20,fontWeight:'bold',margin:'30px'}}>
                  Cách thức ứng tuyển
                </div>
                <p  style={{marginLeft:'30px',display:'flex',flexDirection:'row'}}>Sinh viên ứng tuyển bằng cách bấm <div style={{fontWeight:'bold'}}> Ứng tuyển </div> dưới đây</p><br></br>
              
                <div style={{display:'flex',flexDirection:'row',paddingRight:'30px'}}>
                  <div style={{padding:'5px',marginLeft:'30px',width:'30%',display:'flex',flexDirection:'row',justifyContent:'center',backgroundColor:'green'}}>
                    <div style={{alignSelf:'center',color:'white',fontSize:20,fontWeight:'bold'}}>Ứng tuyển</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'row',justifyContent:'center',borderWidth:'1px',borderColor:'green',width:'20%',marginLeft:'30px'}}>
                    <div style={{color:'green',fontSize:20,alignSelf:'center',fontWeight:'bold'}}>Lưu tin</div>
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'row',padding:'30px'}}>
                  <div style={{backgroundColor:'green',width:'10px',height:'60px'}}></div>
                  <div style={{fontSize:25,fontWeight:'bold',marginLeft:'10px',alignSelf:'center'}}>Việc làm liên quan</div>
                </div>
              </div>
            </div>
          
            {/* Bên phải chiếm 40% */}
            <div style={{ flex: 3.5, padding: '20px'}}>
              <div style={{backgroundColor:'white',padding:'20px'}}>
                <div style={{display:'flex',flexDirection:'row'}}>
                  <img src={anhmau} alt="nahmau" className="w-20 h-auto" style={{borderWidth:'3px',width:100,height:100}} /> 
                  <div style={{margin:'10px',fontSize:25,fontWeight:'bold'}}>CÔNG TY TNHH EMEC VIETNAM</div>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                  <div style={{color:'gray',marginTop:'20px',width:'100px'}}>Quy mô:</div>
                  <div style={{marginTop:'20px',width:'auto'}}>10-24 nhân viên</div>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                  <div style={{color:'gray',marginTop:'20px',width:'100px'}}>Lĩnh vực:</div>
                  <div style={{marginTop:'20px',width:'auto'}}>IT</div>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                  <div style={{color:'gray',marginTop:'20px',width:'100px'}}>Địa điểm:</div>
                  <div style={{marginTop:'20px',width:'auto'}}>03, Nguyễn Văn Bảo, Gò Vấp, TP HCM</div>
                </div>
                <div style={{ color: 'green', margin: '10px', textAlign: 'center' }}>Xem trang công ty</div>
              </div>
              <div style={{backgroundColor:'white',padding:'20px',marginTop:'30px'}}>
                <div style={{fontSize:25,fontWeight:'bold'}}>Thông tin chung</div>
                <div  style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                  <img src={level} alt="level" className="w-20 h-auto" style={{margin:'10px',marginRight:'30px',width:50,height:50}} /> 
                  <div>
                    <div style={{color:'gray'}}>Cấp bậc</div>
                    <div style={{fontWeight:'bold'}}>Nhân viên</div>
                  </div>
                </div>
                <div  style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                  <img src={experience} alt="experience" className="w-20 h-auto" style={{margin:'10px',marginRight:'30px',width:50,height:50}} /> 
                  <div>
                    <div style={{color:'gray'}}>Kinh nghiệm </div>
                    <div style={{fontWeight:'bold'}}>Không yêu cầu kinh nghiệm</div>
                  </div>
                </div>
                <div  style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                  <img src={numberpeople} alt="numberpeople" className="w-20 h-auto" style={{margin:'10px',marginRight:'30px',width:50,height:50}} /> 
                  <div>
                    <div style={{color:'gray'}}>Số lượng tuyển </div>
                    <div style={{fontWeight:'bold'}}>1 người</div>
                  </div>
                </div>
                <div  style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                  <img src={job} alt="job" className="w-20 h-auto" style={{margin:'10px',marginRight:'30px',width:50,height:50}} /> 
                  <div>
                    <div style={{color:'gray'}}>Hình thức làm việc </div>
                    <div style={{fontWeight:'bold'}}>Toàn thời gian</div>
                  </div>
                </div>
                <div  style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                  <img src={gender} alt="gender" className="w-20 h-auto" style={{margin:'10px',marginRight:'30px',width:50,height:50}} /> 
                  <div>
                    <div style={{color:'gray'}}>Giới tính </div>
                    <div style={{fontWeight:'bold'}}>Không yêu cầu</div>
                  </div>
                </div>
              </div>
              <div style={{backgroundColor:'white',padding:'20px',marginTop:'30px'}}>
                <div style={{fontSize:25,fontWeight:'bold'}}>Ngành nghề</div>
                <div style={{margin:'20px', backgroundColor: '#EEEEEE', display: 'inline-block', padding: '5px' }}>Công nghệ thông tin/ IT</div>
                <div style={{fontSize:25,fontWeight:'bold'}}>Khu vực</div>
                <div style={{margin:'20px', backgroundColor: '#EEEEEE', display: 'inline-block', padding: '5px' }}>TP HCM</div>
              </div>
            </div>
          </div>
          <div  style={{backgroundColor:'white',padding:'20px',margin:'20px'}}>
            <div style={{fontWeight:'bold',margin:'30px'}}>Cơ hội ứng tuyển việc làm với đãi ngộ hấp dẫn tại các công ty hàng đầu</div>
            <p style={{marginLeft:'30px'}}>Trước sự phát triển vượt bậc của nền kinh tế, rất nhiều ngành nghề trở nên khan hiếm nhân lực hoặc thiếu nhân lực giỏi. Vì vậy, hầu hết các trường Đại học đều liên kết với các công ty, doanh nghiệp, cơ quan để tạo cơ hội cho các bạn sinh viên được học tập, rèn luyện bản thân và làm quen với môi trường làm việc từ sớm. Trong danh sách việc làm trên đây, TopCV mang đến cho bạn những cơ hội việc làm tại những môi trường làm việc năng động, chuyên nghiệp.</p>
            <div style={{fontWeight:'bold',margin:'30px'}}>Vậy tại sao nên tìm việc tại Top CV?</div>
            <div style={{fontWeight:'bold',margin:'30px'}}>Việc làm chất lượng</div>
            <p style={{marginLeft:'60px'}}>Hàng ngàn tin tuyển dụng chất lượng cao được cập nhật thường xuyên để đáp ứng nhu cầu tìm việc của ứng viên.</p>
            <p style={{marginLeft:'60px'}}>Hệ thống thông minh tự động gợi ý các công việc phù hợp theo CV của bạn.</p>
            <div style={{fontWeight:'bold',margin:'30px'}}>Công cụ viết CV đẹp Miễn phí</div>
            <p style={{marginLeft:'60px'}}>Nhiều mẫu CV đẹp, phù hợp nhu cầu ứng tuyển các vị trí khác nhau.</p>
            <p style={{marginLeft:'60px'}}>Tương tác trực quan, dễ dàng chỉnh sửa thông tin, tạo CV online nhanh chóng trong vòng 5 phút.</p>
            <div style={{fontWeight:'bold',margin:'30px'}}>Hỗ trợ người tìm việc</div>
            <p style={{marginLeft:'60px'}}>Nhà tuyển dụng chủ động tìm kiếm và liên hệ với bạn qua hệ thống kết nối ứng viên thông minh.</p>
            <p style={{marginLeft:'60px'}}>Báo cáo chi tiết Nhà tuyển dụng đã xem CV và gửi offer tới bạn.</p>
            <p style={{margin:'30px'}}>Tại TopCV, bạn có thể tìm thấy những tin tuyển dụng việc làm với mức lương vô cùng hấp dẫn. Những nhà tuyển dụng kết nối với TopCV đều là những công ty lớn tại Việt Nam, nơi bạn có thể làm việc trong một môi trường chuyên nghiệp, năng động, trẻ trung. TopCV là nền tảng tuyển dụng công nghệ cao giúp các nhà tuyển dụng và ứng viên kết nối với nhau. Nhanh tay tạo CV để ứng tuyển vào các vị trí việc làm mới nhất hấp dẫn tại việc làm mới nhất tại Hà Nội, việc làm mới nhất tại TP.HCM ở TopCV, bạn sẽ tìm thấy những việc làm mới nhất với mức lương tốt nhất!</p>
          </div>
        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4">
            <Outlet />
        </main>
    </div>
);
}

export default CandidateNews;