import logo from '@/assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = ({ fullname, email, navLinks, onLogout }: any) => {
    return (
        <nav className="md:h-screen w-full md:w-[300px] md:fixed bg-accent-foreground flex flex-col gap-5 py-5 px-8">
            <div className="mx-5 grid place-items-center">
                <img className="w-20 h-20" src={logo} alt="Company Logo" />
            </div>
            <div>
                <NavLink
                    to="profile"
                    className={({ isActive, isPending }) =>
                        `${isPending ? 'pending' : isActive ? 'bg-background rounded-lg' : ''}  w-full flex items-center gap-2 p-2 font-semibold`
                    }>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn" alt="@shadcn" />
                        <AvatarFallback>{fullname?.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="md:flex flex-col">
                        <h1 className="text-lg capitalize">{fullname}</h1>
                        <h1 className="text-sm lowercase truncate">{email}</h1>
                    </div>
                </NavLink>
            </div>
            <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-5">
                    {navLinks.map((link: any, index: any) => (
                        <NavLink
                            key={index}
                            to={link.to}
                            className={({ isActive, isPending }) =>
                                `${isPending ? 'pending' : isActive ? 'bg-background rounded-lg' : ''}  w-full flex p-2 gap-5 font-semibold`
                            }>
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                    <div>
                        <Button
                            className="w-full text-white hover:bg-primary-foreground"
                            onClick={onLogout}>
                            LOGOUT
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
