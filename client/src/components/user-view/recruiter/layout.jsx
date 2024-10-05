import { Outlet } from 'react-router-dom';
import RecruiterHeader from './header';

function RecruiterLayout() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Header */}
            <RecruiterHeader />
            {/* Main Content */}
            <main className="flex-1 bg-gray-100 p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default RecruiterLayout;
