import { Outlet } from 'react-router-dom';
import UserHeader from './header';

function UserLayout() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Header */}
            <UserHeader />
            {/* Main Content */}
            <main className="flex-1 bg-gray-100 p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default UserLayout;
