import logo from '@/assets/logo.png';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { useState, useEffect } from 'react';
import { login } from '@/api/services/AuthServices';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
    email: z.string().min(1, { message: 'This field has to be filled.' }).email(),
    password: z.string().min(1, { message: 'This field has to be filled.' })
});

const Login = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const userType = useAuthStore((state) => state.userType);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (accessToken) {
            if (userType === 'EMPLOYEE') {
                navigate('/employee');
            }
        } else {
            navigate('/login');
        }
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const setUserType = useAuthStore((state) => state.setUserType);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setUserDetails = useUserStore((state) => state.setUserDetails);

    const onSubmit = async (values: any) => {
        try {
            const data = await login(values);

            setUserType(data.user.userType);
            setAccessToken(data.user.accessToken);
            setUserDetails(data.user.id, data.user.email, data.user.fullname);

            if (data.user.userType === 'EMPLOYEE') {
                navigate('/employee');
            }
            if (data.user.userType === 'HR') {
                navigate('/human-resource');
            }
            if (data.user.userType === 'ADMIN') {
                navigate('/admin');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'Password or Email is incorrect'
            });
            console.error('Login error:', error);
        }
    };
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
                <h1 className="max-sm:mt-20 text-4xl">WELCOME BACK</h1>
                <div className="w-1/2">
                    <div className="flex flex-col gap-2 mt-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2 mt-3">
                                    <Checkbox
                                        id="show-password"
                                        onCheckedChange={() => setShowPassword(!showPassword)}
                                    />
                                    <label
                                        htmlFor="show-password"
                                        className="text-sm font-medium leading-none  cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Show password
                                    </label>
                                </div>
                                <Button
                                    className="w-full text-background bg-accent hover:bg-accent-foreground hover:text-slate-400"
                                    type="submit">
                                    Sign in
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
