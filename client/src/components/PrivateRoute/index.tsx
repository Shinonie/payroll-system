import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

type AllowedRoles = 'EMPLOYEE' | 'ADMIN' | 'HR';

interface PrivateRouteProps {
    allowedRoles: AllowedRoles[];
    fallbackPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, fallbackPath = '/login' }) => {
    const { accessToken, userType } = useAuthStore();
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }

    if (!userType || !allowedRoles.includes(userType as AllowedRoles)) {
        return <Navigate to={fallbackPath} />;
    }

    return <Outlet />;
};

export default PrivateRoute;
