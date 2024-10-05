import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CandidateSearch from './search';
import CandidateJobList from './joblist';
function CandidateHome() {
  return (
    <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
          <CandidateSearch />
          <CandidateJobList/>
        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4">
            <Outlet />
        </main>
    </div>
);
}

export default CandidateHome;
