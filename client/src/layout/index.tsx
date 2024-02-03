import { Outlet } from 'react-router-dom';

const Root = () => {
    return (
        <div className="font-poppins w-screen h-screen bg-background">
            <Outlet />
        </div>
    );
};

export default Root;
