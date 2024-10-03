import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserSearch from './search';
import UserListJob from './listjob';
function UserHome() {
  return (
    <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
          <UserSearch />
          <UserListJob/>
        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4">
            <Outlet />
        </main>
    </div>
);
}

export default UserHome;
