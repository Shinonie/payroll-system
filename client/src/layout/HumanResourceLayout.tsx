import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HumanResource = () => {
    return (
        <div className="font-poppins">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default HumanResource;
