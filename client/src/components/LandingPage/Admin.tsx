import { Link } from 'react-router-dom';
import {
    UserPlus,
    Users,
    Wallet,
    SlidersHorizontal,
    CalendarClock,
    FilePenLine,
    PackageOpen
} from 'lucide-react';
import logo from '@/assets/logo.png';
import { Button } from '../ui/button';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { logout } from '@/api/services/AuthServices';

const AdminLandingPage = () => {
    const navLinks = [
        { to: 'create-employee', icon: <UserPlus />, label: 'CREATE ACCOUNT' },
        { to: 'employees', icon: <Users />, label: 'EMPLOYEES' },
        { to: 'payrolls', icon: <Wallet />, label: 'PAYROLLS' },
        { to: 'adjustments', icon: <SlidersHorizontal />, label: 'ADJUSTMENTS' },
        { to: 'leaves', icon: <CalendarClock />, label: 'EMPLOYEE LEAVES' },
        { to: 'taxes', icon: <FilePenLine />, label: 'EDIT CONTRIBUTION' },
        { to: 'archive', icon: <PackageOpen />, label: 'ARCHIVE ACCOUNT' }
    ];
    const { clearAuth } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="absolute inset-0 bg-secondary flex flex-col p-10">
            <div className="mx-5 grid place-items-center">
                <img className="w-[200px] h-[200px]" src={logo} alt="Company Logo" />
            </div>
            <div className="text-center mb-5">
                <Button
                    className="w-1/6 text-white hover:bg-primary-foreground"
                    onClick={() => {
                        clearAuth();
                        logout();
                        navigate('/login', { replace: true });
                    }}>
                    LOGOUT
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {navLinks.map((link, index) => (
                    <Link key={index} to={link.to} className="nav-link">
                        <div className="nav-card text-white bg-primary hover:bg-primary-foreground rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                            <div className="nav-icon">{link.icon}</div>
                            <span className="nav-label text-center">{link.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminLandingPage;
