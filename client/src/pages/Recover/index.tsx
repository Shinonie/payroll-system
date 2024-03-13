import logo from '@/assets/logo.png';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { RecoverAccount } from '@/api/services/AuthServices';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z
    .object({
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        confirmPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: 'Passwords must match!',
        path: ['confirmPassword']
    });

export default function RecoverPassword() {
    const { id, token } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: RecoverAccount,
        onSuccess: () => {
            toast({
                title: 'Forgot Password',
                description: 'The account recovery will automatically to your email'
            });
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        }
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = (values: any) => {
        mutate({ id, token, ...values });
    };

    return (
        <div className="flex flex-col items-center h-screen rounded">
            <div className="mx-5 grid place-items-center">
                <img className="w-[200px] h-[200px]" src={logo} alt="Company Logo" />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2 bg-primary-foreground rounded-lg px-20 py-10 w-1/3">
                    <h1 className="text-white">Your account has been recoverd.</h1>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-xl">New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-xl">
                                    Confirm Password
                                </FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className="w-full text-background bg-accent hover:bg-accent-foreground hover:text-slate-400"
                        type="submit">
                        SEND
                    </Button>
                </form>
            </Form>
        </div>
    );
}
