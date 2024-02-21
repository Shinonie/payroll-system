import logo from '@/assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Wallet, LogOut, CalendarClock, CalendarCheck2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    return (
        <nav className="md:h-screen w-[400px] md:fixed bg-accent-foreground flex flex-col gap-5 py-5 px-8 text-accent">
            <div className="mx-5 grid place-items-center">
                <img className="w-20 h-20" src={logo} alt="Company Logo" />
            </div>
            <div>
                <NavLink
                    to="profile"
                    className={({ isActive, isPending }) =>
                        `${isPending ? 'pending' : isActive ? 'bg-background rounded-lg' : ''}  w-full flex justify-evenly items-center gap-2 p-2 font-semibold`
                    }>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className="text-sm">SARAH MAE BARBASA</h1>
                </NavLink>
            </div>
            <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-5">
                    <NavLink
                        to="attendance"
                        className={({ isActive, isPending }) =>
                            `${isPending ? 'pending' : isActive ? 'bg-background rounded-lg' : ''}  w-full flex p-2 gap-5 font-semibold`
                        }>
                        <CalendarCheck2 />
                        ATTENDANCE
                    </NavLink>
                    <NavLink
                        to="payroll"
                        className={({ isActive, isPending }) =>
                            `${isPending ? 'pending' : isActive ? 'bg-background rounded-lg' : ''}  w-full flex p-2 gap-5 font-semibold`
                        }>
                        <Wallet />
                        PAYROLL
                    </NavLink>
                    <NavLink
                        to="leave"
                        className={({ isActive, isPending }) =>
                            `${isPending ? 'pending' : isActive ? 'bg-background rounded-lg' : ''}  w-full flex p-2 gap-5 font-semibold`
                        }>
                        <CalendarClock />
                        MY LEAVE
                    </NavLink>
                    <NavLink
                        to="schedule"
                        className={({ isActive, isPending }) =>
                            `${isPending ? 'pending' : isActive ? 'bg-background rounded-lg' : ''}  w-full flex p-2 gap-5 font-semibold`
                        }>
                        <CalendarDays />
                        MY SCHEDULE
                    </NavLink>
                    <div>
                        <Button className="w-full text-background bg-accent hover:bg-accent-foreground hover:text-slate-400">
                            <LogOut className="mr-2" />
                            LOGOUT
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
