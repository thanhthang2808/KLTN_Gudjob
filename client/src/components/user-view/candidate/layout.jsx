import { Outlet } from 'react-router-dom';
import CandidateHeader from './header';

function CandidateLayout() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Header */}
            <CandidateHeader />
            {/* Main Content */}
            <main className="flex-1 bg-gray-100 p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default CandidateLayout;
