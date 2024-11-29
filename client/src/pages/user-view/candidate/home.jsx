import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CandidateSearch from './search';
import CandidateJobList from './joblist';
import BannerSlider from '@/components/user-view/candidate/banner-slider';

import welcomeBg from '@/assets/bg.jpg';

function CandidateHome() {
  return (
    <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex flex-col bg-green-200 w-full p-4 bg-cover items-center bg-center" style={{ backgroundImage: `url(${welcomeBg})` }}>
          <h1 className="text-2xl text-green-600 font-bold max-w-[80%]">Gudjob - Tìm việc, nhận việc an toàn và nhanh chóng. </h1>
          <h1 className="text-sm my-2 text-white max-w-[80%]">Sàn giao dịch việc làm uy tín nhất, kết nối hơn 40,000 cơ hội việc làm mỗi ngày từ hàng nghìn doanh nghiệp hàng đầu tại Việt Nam. </h1>
          <CandidateSearch />          
          <BannerSlider />
        </div>
        <h1 className="text-2xl mt-2 ml-20 text-gray-600 font-semibold max-w-[80%]">Gợi ý việc làm phù hợp</h1>
        <CandidateJobList/>
        
        <main className="flex-1 bg-gray-100 p-4">
            <Outlet />
        </main>
    </div>
  );
}


export default CandidateHome;
