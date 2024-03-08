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

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateEmployeeAccount } from '@/api/services/admin/Employee';

const EmployeeSchema = z.object({
    controlNumber: z.string().min(1, { message: 'This field is required' }),
    fullname: z.string().min(1, { message: 'This field is required' }),
    email: z.string().min(1, { message: 'This field is required' }),
    birthday: z.string().datetime(),
    gender: z.string().min(1, { message: 'This field is required' }),
    civilStatus: z.string().min(1, { message: 'This field is required' }),
    address: z.string().min(1, { message: 'This field is required' }),
    userType: z.string().min(1, { message: 'This field is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

function generateRandomPassword() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

const CreateEmployee = () => {
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof EmployeeSchema>>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
            fullname: '',
            controlNumber: '',
            email: '',
            password: '',
            birthday: '',
            gender: '',
            civilStatus: '',
            address: '',
            userType: ''
        }
    });

    const {
        formState: { errors },
        reset
    } = form;

    const { mutate } = useMutation({
        mutationFn: CreateEmployeeAccount,
        onSuccess: () => {
            toast({
                title: 'Employee Account',
                description: 'Account is successfully created.'
            });
            reset();
            queryClient.invalidateQueries({ queryKey: ['employee'] });
        }
    });

    const onSubmit = (data: z.infer<typeof EmployeeSchema>) => {
        mutate(data);
    };

    const handleGeneratePassword = () => {
        const newPassword = generateRandomPassword();
        form.setValue('password', newPassword);
    };

    return (
        <div className="h-full md:flex justify-center items-center">
            <main className="w-full flex justify-center items-center py-1 md:w-2/3 lg:w-3/4 bg-accent rounded-lg">
                <div className="p-2 md:p-4">
                    <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                        {/* <h2 className="pl-6 text-2xl font-bold sm:text-xl">MY PROFILE</h2> */}

                        <div className="grid max-w-2xl mx-auto">
                            <div className="md:flex justify-between">
                                <h2 className="text-xl md:text-3xl font-bold max-sm:mb-2">
                                    REGISTRATION FORM
                                </h2>
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
                                                name="controlNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label
                                                            htmlFor="controlNumber"
                                                            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Control Number
                                                        </Label>
                                                        <Input
                                                            {...field}
                                                            id="controlNumber"
                                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                            placeholder="ex. 2024-0001"
                                                        />
                                                        {errors.controlNumber && (
                                                            <p className="text-red-500 text-sm mt-1">
                                                                {errors.controlNumber.message}
                                                            </p>
                                                        )}
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="userType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Employee Type
                                                        </Label>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}>
                                                            <SelectTrigger className="md:w-full">
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="EMPLOYEE">
                                                                    EMPLOYEE
                                                                </SelectItem>
                                                                <SelectItem value="ADMIN">
                                                                    ADMIN
                                                                </SelectItem>
                                                                <SelectItem value="HR">
                                                                    Human Resources
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
                                    </div>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6 mt-5">
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="fullname"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="first_name"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Full Name
                                                            </Label>
                                                            <Input
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
                                                        <Label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Gender
                                                        </Label>
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
                                                        <Label className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Civil Status
                                                        </Label>
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
                                                        <Label
                                                            htmlFor="last_name"
                                                            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Birthday
                                                        </Label>
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
                                                        <Label
                                                            htmlFor="email"
                                                            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Your email
                                                        </Label>
                                                        <Input
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
                                        <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6 mt-5">
                                            <div className="w-full">
                                                <FormField
                                                    control={form.control}
                                                    name="password"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Label
                                                                htmlFor="password"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Password
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type={
                                                                    showPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                placeholder="••••••••"
                                                                id="password"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                            />
                                                            {errors.password && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.password.message}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-2 mt-3">
                                                                <Checkbox
                                                                    id="show-password"
                                                                    onCheckedChange={() =>
                                                                        setShowPassword(
                                                                            !showPassword
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor="show-password"
                                                                    className="text-sm font-medium leading-none  cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    Show password
                                                                </label>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="w-full">
                                                <Button
                                                    type="button"
                                                    className="w-full text-white hover:bg-primary-foreground"
                                                    onClick={handleGeneratePassword}>
                                                    Generate Password
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mb-2 sm:mb-6">
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Label
                                                            htmlFor="address"
                                                            className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                            Address
                                                        </Label>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            id="address"
                                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                            placeholder="Employee Address"
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
                                        <Button
                                            type="submit"
                                            className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">
                                            Regiter
                                        </Button>
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

export default CreateEmployee;
