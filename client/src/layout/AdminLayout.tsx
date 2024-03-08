import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import {
    Wallet,
    CalendarClock,
    SlidersHorizontal,
    Users,
    PackageOpen,
    UserPlus,
    FilePenLine
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '@/store/useAuthStore';
import { logout } from '@/api/services/AuthServices';

const navLinks = [
    { to: 'create-employee', icon: <UserPlus />, label: 'CREATE ACCOUNT' },
    { to: 'employees', icon: <Users />, label: 'EMPLOYEES' },
    { to: 'payrolls', icon: <Wallet />, label: 'PAYROLLS' },
    { to: 'adjustments', icon: <SlidersHorizontal />, label: 'ADJUSTMENTS' },
    { to: 'leaves', icon: <CalendarClock />, label: 'EMPLOYEE LEAVES' },
    { to: 'taxes', icon: <FilePenLine />, label: 'EDIT TAXES' },
    { to: 'archive', icon: <PackageOpen />, label: 'ARCHIVE ACCOUNT' }
];

const AdminLayout = () => {
    const { fullname, email } = useUserStore();
    const { clearAuth } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="font-poppins  flex max-sm:flex-wrap">
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
            <div className="md:ml-[300px] w-full p-10">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
