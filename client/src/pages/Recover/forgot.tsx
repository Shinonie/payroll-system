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
import { ForgotAccount } from '@/api/services/AuthServices';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
    email: z.string().min(1, { message: 'This field has to be filled.' }).email()
});

export default function ForgotPassword() {
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    });

    const { mutate } = useMutation({
        mutationFn: ForgotAccount
    });

    const onSubmit = (values: any) => {
        mutate(values);

        toast({
            title: 'Forgot Password',
            description: 'The account recovery will automatically to your email'
        });

        setTimeout(() => {
            navigate(-1);
        }, 3000);
        // console.log(values);
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
                    <h1 className="text-white">
                        Use you email to request and recover your account
                    </h1>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white text-xl">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
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
