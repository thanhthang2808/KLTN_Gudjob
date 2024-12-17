import { Outlet } from 'react-router-dom';
import RecruiterHeader from './header';

function RecruiterLayout() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            
            
            {/* Main Content */}
            <main className="flex-1 mt-20">
                <Outlet />
            </main>
            <RecruiterHeader />
        </div>
    );
}

export default RecruiterLayout;
