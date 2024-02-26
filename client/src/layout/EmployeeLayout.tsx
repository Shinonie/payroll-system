import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const EmployeeLayout = () => {
    return (
        <div className="font-poppins flex max-sm:flex-wrap">
            <Navbar />
            <div className="md:ml-[300px] w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default EmployeeLayout;
