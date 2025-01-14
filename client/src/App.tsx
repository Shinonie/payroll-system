import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Root from '@/layout';
import AdminLayout from '@/layout/AdminLayout';
import EmployeeLayout from '@/layout/EmployeeLayout';
import HumanResourceLayout from '@/layout/HumanResourceLayout';

import Login from '@/pages/Login';
import Register from '@/pages/Register';

// EMPLOYEE
import AttendanceEmployee from '@/pages/Employee/Attendance';
import ScheduleEmployee from '@/pages/Employee/Schedule';
import PayrollEmployee from '@/pages/Employee/Payroll';
import LeaveEmployee from '@/pages/Employee/Leave';
import Profile from '@/pages/Employee/Profile';
import PrivateRoute from '@/components/PrivateRoute';

// HR
import EmployeeHR from '@/pages/HumanResource/Employee';
import AttendancesHR from '@/pages/HumanResource/components/Attendance';
import PayrollHR from '@/pages/HumanResource/Payrolls';
import AdjustmentHR from '@/pages/HumanResource/Adjustments';
import LeavesHR from '@/pages/HumanResource/Leaves';
import ScheduleHR from '@/pages/HumanResource/components/Schedules';
import TaxesHR from '@/pages/HumanResource/Taxes';

// ADMIN
import EmployeeAdmin from '@/pages/Admin/Employee';
import AttendancesAdmin from '@/pages/Admin/components/Attendance';
import PayrollAdmin from '@/pages/Admin/Payrolls';
import AdjustmentAdmin from '@/pages/Admin/Adjustments';
import LeavesAdmin from '@/pages/Admin/Leaves';
import ScheduleAdmin from '@/pages/Admin/components/Schedules';
import Archive from '@/pages/Admin/Archive';
import CreateEmployee from '@/pages/Admin/AccountCreation';
import TaxesAdmin from '@/pages/Admin/Taxes';
import PayrollPreview from '@/components/PayrollPreview';
import PostViewPayroll from './components/PostViewPayroll';

import AdminLandingPage from '@/components/LandingPage/Admin';
import HRLandingPag from '@/components/LandingPage/HR';

import ForgotPassword from '@/pages/Recover/forgot';
import RecoverPassword from '@/pages/Recover';

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
            },
            {
                path: '/forgot',
                element: <ForgotPassword />
            },
            {
                path: '/recover/:id/:token',
                element: <RecoverPassword />
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
                element: <PrivateRoute allowedRoles={['HR']} />,
                children: [
                    {
                        path: '',
                        element: <HRLandingPag />
                    },
                    {
                        path: 'employees',
                        element: <EmployeeHR />
                    },
                    {
                        path: 'attendance/:id',
                        element: <AttendancesHR />
                    },
                    {
                        path: 'payroll/:id',
                        element: <PayrollPreview />
                    },
                    {
                        path: 'payroll/view/:id',
                        element: <PostViewPayroll />
                    },
                    {
                        path: 'schedule/:id',
                        element: <ScheduleHR />
                    },
                    {
                        path: 'payrolls',
                        element: <PayrollHR />
                    },
                    {
                        path: 'leaves',
                        element: <LeavesHR />
                    },
                    {
                        path: 'adjustments',
                        element: <AdjustmentHR />
                    },
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'taxes',
                        element: <TaxesHR />
                    }
                ]
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: '',
                element: <PrivateRoute allowedRoles={['ADMIN']} />,
                children: [
                    {
                        path: '',
                        element: <AdminLandingPage />
                    },
                    {
                        path: 'employees',
                        element: <EmployeeAdmin />
                    },
                    {
                        path: 'attendance/:id',
                        element: <AttendancesAdmin />
                    },
                    {
                        path: 'payroll/:id',
                        element: <PayrollPreview />
                    },
                    {
                        path: 'payroll/view/:id',
                        element: <PostViewPayroll />
                    },
                    {
                        path: 'schedule/:id',
                        element: <ScheduleAdmin />
                    },
                    {
                        path: 'payrolls',
                        element: <PayrollAdmin />
                    },
                    {
                        path: 'leaves',
                        element: <LeavesAdmin />
                    },
                    {
                        path: 'adjustments',
                        element: <AdjustmentAdmin />
                    },
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'archive',
                        element: <Archive />
                    },
                    {
                        path: 'create-employee',
                        element: <CreateEmployee />
                    },
                    {
                        path: 'taxes',
                        element: <TaxesAdmin />
                    }
                ]
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
