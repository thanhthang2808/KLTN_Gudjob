import { Outlet } from 'react-router-dom';
import CandidateHeader from './header';

function CandidateLayout() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Header */}
            
            {/* Main Content */}
            <main className="flex-1 mt-20">
                <Outlet />
            </main>
            <CandidateHeader />
        </div>
    );
}

export default CandidateLayout;
