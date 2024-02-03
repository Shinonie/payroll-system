import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from '@/layout';
import AdminLayout from '@/layout/AdminLayout';
import EmployeeLayout from '@/layout/EmployeeLayout';
import HumanResourceLayout from '@/layout/HumanResourceLayout';

import Login from '@/pages/Login';
import Register from '@/pages/Register';

import Admin from './pages/Admin';
import HumanResource from './pages/HumanResource';
import Employee from './pages/Employee';

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
                element: <Employee />
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
