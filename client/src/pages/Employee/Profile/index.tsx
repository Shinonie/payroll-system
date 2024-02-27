import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format, parse } from 'date-fns';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUserStore } from '@/store/useUserStore';
import { GetUserEmployee, EditUserProfile } from '@/api/services/employee/Employee';
import { ChangePassword } from '@/api/services/AuthServices';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useState } from 'react';

const EmployeeSchema = z.object({
    fullname: z.string().min(1, { message: 'This field is required' }),
    email: z.string().min(1, { message: 'This field is required' }),
    birthday: z.string().datetime(),
    gender: z.string().min(1, { message: 'This field is required' }),
    civilStatus: z.string().min(1, { message: 'This field is required' }),
    address: z.string().min(1, { message: 'This field is required' })
});

const ChangePasswordSchema = z
    .object({
        newPassword: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        confirmPassword: z.string()
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword']
    });

const Profile = () => {
    const employeeID = useUserStore().userId;
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const { isLoading, data } = useQuery({
        queryFn: () => GetUserEmployee(employeeID),
        queryKey: ['profile'],
        staleTime: 10000
    });

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: EditUserProfile,
        onSuccess: () => {
            toast({
                title: 'Profile updated',
                description: 'Profile has been updated'
            });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });

    const { mutate: changePasswordMutation } = useMutation({
        mutationFn: ChangePassword,
        onSuccess: () => {
            changePasswordForm.reset();
            setOpen(false);
            toast({
                title: 'Change Password',
                description: 'Password has been changed'
            });
        }
    });

    const changePasswordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        }
    });

    const form = useForm<z.infer<typeof EmployeeSchema>>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
            fullname: '',
            email: '',
            birthday: '',
            gender: '',
            civilStatus: '',
            address: ''
        }
    });

    useEffect(() => {
        if (!isLoading && data) {
            form.reset(data);
        }
    }, [isLoading, data, form]);

    const {
        formState: { errors }
    } = form;

    const {
        formState: { errors: changePasswordFormErrors }
    } = changePasswordForm;

    const onSubmit = (data: z.infer<typeof EmployeeSchema>) => {
        mutate({ id: employeeID, data });
    };

    const onSubmitChangePassword = (data: z.infer<typeof ChangePasswordSchema>) => {
        changePasswordMutation({ id: employeeID, newPassword: data.confirmPassword });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full md:flex justify-center items-center mt-10">
            <main className="w-full flex justify-center items-center py-1 md:w-2/3 lg:w-3/4 bg-accent rounded-lg">
                <div className="p-2 md:p-4">
                    <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                        {/* <h2 className="pl-6 text-2xl font-bold sm:text-xl">MY PROFILE</h2> */}

                        <div className="grid max-w-2xl mx-auto">
                            <div className="md:flex justify-between">
                                <h2 className="text-xl md:text-3xl font-bold max-sm:mb-2">
                                    MY PROFILE
                                </h2>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Change Password</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm-max:max-w-[425px] ">
                                        <DialogHeader>
                                            <DialogTitle>Change Password</DialogTitle>
                                            <DialogDescription className="text-primary">
                                                Make sure to remember your new password
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...changePasswordForm}>
                                            <form
                                                onSubmit={changePasswordForm.handleSubmit(
                                                    onSubmitChangePassword
                                                )}>
                                                <div className="grid gap-4 py-4">
                                                    <FormField
                                                        control={changePasswordForm.control}
                                                        name="newPassword"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label
                                                                        htmlFor="newPassword"
                                                                        className="text-right">
                                                                        New Password
                                                                    </Label>
                                                                    <Input
                                                                        {...field}
                                                                        id="newPassword"
                                                                        type="password"
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                                {changePasswordFormErrors.confirmPassword && (
                                                                    <p className="text-red-500 text-sm mt-1">
                                                                        {
                                                                            changePasswordFormErrors
                                                                                .confirmPassword
                                                                                .message
                                                                        }
                                                                    </p>
                                                                )}
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={changePasswordForm.control}
                                                        name="confirmPassword"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label
                                                                        htmlFor="confirmNewPassword"
                                                                        className="text-right">
                                                                        Confirm New Password
                                                                    </Label>
                                                                    <Input
                                                                        {...field}
                                                                        type="password"
                                                                        id="confirmNewPassword"
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {/* <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                <div className="mt-2">
                                    <img
                                        className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=htmlFormat&fit=crop&w=500&q=60"
                                        alt="Bordered avatar"
                                    />
                                    <div>
                                        <h1>ID</h1>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-5 sm:ml-8">
                                    <button
                                        type="button"
                                        className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 ">
                                        Change picture
                                    </button>
                                    <button
                                        type="button"
                                        className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 ">
                                        Delete picture
                                    </button>
                                </div>
                            </div> */}
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6 mt-5">
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="fullname"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="first_name"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Full Name
                                                            </label>
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                id="first_name"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="Full Name"
                                                            />
                                                            {errors.fullname && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.fullname.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Gender
                                                        </label>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="male">
                                                                    Male
                                                                </SelectItem>
                                                                <SelectItem value="female">
                                                                    Female
                                                                </SelectItem>
                                                                <SelectItem value="lgbtqia+">
                                                                    LGBQIA+
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.gender && (
                                                            <p className="text-red-500 text-sm mt-1">
                                                                {errors.gender.message}
                                                            </p>
                                                        )}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="civilStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Civil Status
                                                        </label>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}>
                                                            <SelectTrigger className="md:w-[150px]">
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="single">
                                                                    Single
                                                                </SelectItem>
                                                                <SelectItem value="married">
                                                                    Married
                                                                </SelectItem>
                                                                <SelectItem value="separated">
                                                                    Separated
                                                                </SelectItem>
                                                                <SelectItem value="widowed">
                                                                    Widowed
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.civilStatus && (
                                                            <p className="text-red-500 text-sm mt-1">
                                                                {errors.civilStatus.message}
                                                            </p>
                                                        )}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="birthday"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <label
                                                            htmlFor="last_name"
                                                            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Birthday
                                                        </label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={'outline'}
                                                                        className={cn(
                                                                            'w-[240px] pl-3 text-left font-normal'
                                                                        )}>
                                                                        {field.value ? (
                                                                            format(
                                                                                field.value,
                                                                                'PPP'
                                                                            )
                                                                        ) : (
                                                                            <span>Pick a date</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    onSelect={(date) => {
                                                                        if (date) {
                                                                            const dateString =
                                                                                date?.toString();
                                                                            const parsedDate =
                                                                                parse(
                                                                                    dateString,
                                                                                    "EEE MMM dd yyyy HH:mm:ss 'GMT'XX '(Singapore Standard Time)'",
                                                                                    new Date()
                                                                                );
                                                                            const isoString =
                                                                                format(
                                                                                    parsedDate,
                                                                                    "yyyy-MM-dd'T'HH:mm:ss'Z'"
                                                                                );

                                                                            console.log(isoString);
                                                                            field.onChange(
                                                                                isoString
                                                                            );
                                                                        }
                                                                    }}
                                                                    disabled={(date) =>
                                                                        date > new Date() ||
                                                                        date <
                                                                            new Date('1900-01-01')
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>

                                                        {errors.birthday && (
                                                            <p className="text-red-500 text-sm mt-1">
                                                                {errors.birthday.message}
                                                            </p>
                                                        )}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="items-center mt-8 text-[#202142]">
                                        <div className="mb-2 sm:mb-6">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <label
                                                            htmlFor="email"
                                                            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Your email
                                                        </label>
                                                        <input
                                                            {...field}
                                                            type="email"
                                                            id="email"
                                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                            placeholder="your.email@mail.com"
                                                        />
                                                        {errors.email && (
                                                            <p className="text-red-500 text-sm mt-1">
                                                                {errors.email.message}
                                                            </p>
                                                        )}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-2 sm:mb-6">
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <label
                                                            htmlFor="address"
                                                            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Address
                                                        </label>
                                                        <input
                                                            {...field}
                                                            type="text"
                                                            id="profession"
                                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                            placeholder="your profession"
                                                        />
                                                        {errors.address && (
                                                            <p className="text-red-500 text-sm mt-1">
                                                                {errors.address.message}
                                                            </p>
                                                        )}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
