import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Root from '@/layout';
import AdminLayout from '@/layout/AdminLayout';
import EmployeeLayout from '@/layout/EmployeeLayout';
import HumanResourceLayout from '@/layout/HumanResourceLayout';

import Login from '@/pages/Login';
import Register from '@/pages/Register';

import Admin from '@/pages/Admin';
import HumanResource from '@/pages/HumanResource';
import AttendanceEmployee from '@/pages/Employee/Attendance';
import ScheduleEmployee from '@/pages/Employee/Schedule';
import PayrollEmployee from '@/pages/Employee/Payroll';
import LeaveEmployee from '@/pages/Employee/Leave';
import Profile from '@/pages/Employee/Profile';
import PrivateRoute from '@/components/PrivateRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Login />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: '',
                element: <Admin />
            }
        ]
    },
    {
        path: '/employee',
        element: <EmployeeLayout />,
        children: [
            {
                path: '',
                element: <PrivateRoute allowedRoles={['EMPLOYEE']} />,
                children: [
                    {
                        path: '',
                        element: <AttendanceEmployee />
                    },
                    {
                        path: 'attendance',
                        element: <AttendanceEmployee />
                    },
                    {
                        path: 'payroll',
                        element: <PayrollEmployee />
                    },
                    {
                        path: 'leave',
                        element: <LeaveEmployee />
                    },
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'schedule',
                        element: <ScheduleEmployee />
                    }
                ]
            }
        ]
    },
    {
        path: '/human-resource',
        element: <HumanResourceLayout />,
        children: [
            {
                path: '',
                element: <HumanResource />
            }
        ]
    }
]);

const queryClient = new QueryClient();
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
}

export default App;
