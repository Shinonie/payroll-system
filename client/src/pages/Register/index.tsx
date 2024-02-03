import logo from '@/assets/logo.png';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const Register = () => {
    return (
        <div className="flex w-full h-full">
            <div className="hidden xl:flex hero  justify-center items-center bg-accent-foreground w-1/2">
                <div className="w-[400px] h-[400px]">
                    <img src={logo} className="w-full h-full" alt="Company logo" />
                </div>
            </div>
            <div className="login w-full md:w-1/2 flex flex-col gap-2 md:justify-center items-center">
                <div className="xl:hidden w-[200px] h-[200px]">
                    <img src={logo} className="w-full h-full" alt="Company logo" />
                </div>
                <h1 className="max-sm:mt-20 text-4xl">VALIDATE / REGISTER</h1>
                <div className="w-1/2">
                    <div className="flex flex-col gap-2 mt-5">
                        <div className="input">
                            <h1>Control Number</h1>
                            <Input placeholder="Control Number" />
                        </div>
                        <div className="input">
                            <h1>Username</h1>
                            <Input placeholder="Username" />
                        </div>
                        <div className="input">
                            <h1>PASSWORD</h1>
                            <Input placeholder="********" type="password" />
                            <div className="flex items-center gap-2 mt-3">
                                <Checkbox id="show-password" />
                                <label
                                    htmlFor="show-password"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Show password
                                </label>
                            </div>
                        </div>
                        <Button className="w-full text-background bg-accent hover:bg-accent-foreground hover:text-slate-400">
                            LOGIN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
