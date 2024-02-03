import { RouterProvider, createBrowserRouter } from 'react-router-dom';
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
                element: <AttendanceEmployee />
            },
            {
                path: 'schedule',
                element: <ScheduleEmployee />
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

function App() {
    return <RouterProvider router={router} />;
}

export default App;
