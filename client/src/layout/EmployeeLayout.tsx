import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

import { Wallet, CalendarClock, CalendarCheck2, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';
import { logout } from '@/api/services/AuthServices';

const navLinks = [
    { to: 'payroll', icon: <Wallet />, label: 'PAYROLL' },
    { to: 'attendance', icon: <CalendarCheck2 />, label: 'ATTENDANCE' },
    { to: 'leave', icon: <CalendarClock />, label: 'MY LEAVE' },
    { to: 'schedule', icon: <CalendarDays />, label: 'MY SCHEDULE' }
];

const EmployeeLayout = () => {
    const { fullname, email } = useUserStore();
    const { clearAuth } = useAuthStore();
    const navigate = useNavigate();
    return (
        <div className="font-poppins flex max-sm:flex-wrap">
            <Navbar
                fullname={fullname}
                email={email}
                navLinks={navLinks}
                onLogout={() => {
                    clearAuth();
                    logout();
                    navigate('/login', { replace: true });
                }}
            />
            <div className="md:ml-[300px] w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default EmployeeLayout;
