import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const EmployeeLayout = () => {
    return (
        <div className="font-poppins flex max-sm:flex-wrap">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default EmployeeLayout;
