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
    firstName: z.string().min(1, { message: 'This field is required' }),
    lastName: z.string().min(1, { message: 'This field is required' }),
    middleName: z.string(),
    email: z.string().min(1, { message: 'This field is required' }),
    birthday: z.string().datetime(),
    gender: z.string().min(1, { message: 'This field is required' }),
    SSSLoan: z.number().optional(),
    PagibigLoan: z.number().optional(),
    allowance: z.number().optional(),
    incentives: z.number().optional(),
    hourlyRate: z.number().min(1, { message: 'This field is required' }),
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
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof EmployeeSchema>>({
        resolver: zodResolver(EmployeeSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            middleName: '',
            controlNumber: '',
            email: '',
            password: '',
            birthday: '',
            gender: '',
            civilStatus: '',
            address: '',
            SSSLoan: 0,
            PagibigLoan: 0,
            hourlyRate: 0,
            allowance: 0,
            incentives: 0,
            userType: 'EMPLOYEE'
        }
    });

    const {
        formState: { errors },
        reset
    } = form;

    const { mutate } = useMutation({
        mutationFn: CreateEmployeeAccount,
        onSettled: () => {
            setIsLoading(true);
        },
        onSuccess: () => {
            toast({
                title: 'Employee Account',
                description: 'Account is successfully created.'
            });
            reset();
            queryClient.invalidateQueries({ queryKey: ['employee'] });
        },
        onError: (data: any) => {
            const { response } = data;

            toast({
                variant: 'destructive',
                title: 'Employee Account',
                description: response.data.message
            });
        }
    });

    const onSubmit = (data: z.infer<typeof EmployeeSchema>) => {
        console.log(data);
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
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <h1 className="text-lg mt-10 mb-3 text-white font-bold">
                                        PERSONAL INFORMATIONS
                                    </h1>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 ">
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
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="firstName"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Firstname
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                id="firstName"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="John"
                                                            />
                                                            {errors.firstName && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.firstName.message}
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
                                                name="middleName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="middleName"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Middlename
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                id="middleName"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="Smith"
                                                            />
                                                            {errors.middleName && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.middleName.message}
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
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="lastName"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Lastname
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                id="lastName"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="Doe"
                                                            />
                                                            {errors.lastName && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.lastName.message}
                                                                </p>
                                                            )}
                                                        </div>
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
                                    <h1 className="text-lg mt-10 mb-3 text-white font-bold">
                                        SALARY & LOAN INFORMATION
                                    </h1>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6 mt-5">
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="PagibigLoan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="PagibigLoan"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                PagibigLoan
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                id="PagibigLoan"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="PagibigLoan"
                                                                onChange={(e) => {
                                                                    const inputValue =
                                                                        e.target.value;
                                                                    const parsedValue =
                                                                        inputValue.trim() !== ''
                                                                            ? parseFloat(inputValue)
                                                                            : '';
                                                                    field.onChange(parsedValue);
                                                                }}
                                                            />
                                                            {errors.PagibigLoan && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.PagibigLoan.message}
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
                                                name="SSSLoan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="SSSLoan"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                SSS Loan
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                id="SSSLoan"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="SSSLoan"
                                                                onChange={(e) => {
                                                                    const inputValue =
                                                                        e.target.value;
                                                                    const parsedValue =
                                                                        inputValue.trim() !== ''
                                                                            ? parseFloat(inputValue)
                                                                            : '0';
                                                                    field.onChange(parsedValue);
                                                                }}
                                                            />
                                                            {errors.SSSLoan && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.SSSLoan.message}
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
                                                name="incentives"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="incentives"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Incentives
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                id="incentives"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="incentives"
                                                                onChange={(e) => {
                                                                    const inputValue =
                                                                        e.target.value;
                                                                    const parsedValue =
                                                                        inputValue.trim() !== ''
                                                                            ? parseFloat(inputValue)
                                                                            : '0';
                                                                    field.onChange(parsedValue);
                                                                }}
                                                            />
                                                            {errors.incentives && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.incentives.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6 mt-5">
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="allowance"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="allowance"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Allowance
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                id="allowance"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="allowance"
                                                                onChange={(e) => {
                                                                    const inputValue =
                                                                        e.target.value;
                                                                    const parsedValue =
                                                                        inputValue.trim() !== ''
                                                                            ? parseFloat(inputValue)
                                                                            : '0';
                                                                    field.onChange(parsedValue);
                                                                }}
                                                            />
                                                            {errors.allowance && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.allowance.message}
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
                                                name="hourlyRate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="hourlyRate"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Hourly Rate
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                id="hourlyRate"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="hourlyRate"
                                                                onChange={(e) => {
                                                                    const inputValue =
                                                                        e.target.value;
                                                                    const parsedValue =
                                                                        inputValue.trim() !== ''
                                                                            ? parseFloat(inputValue)
                                                                            : '0';
                                                                    field.onChange(parsedValue);
                                                                }}
                                                            />
                                                            {errors.hourlyRate && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.hourlyRate.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <h1 className="text-lg mt-10 mb-3 text-white font-bold">
                                        ACCOUNT INFORMATIONS
                                    </h1>
                                    <div className="items-center text-[#202142]">
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
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            disabled={isLoading}
                                            type="submit"
                                            className="w-full text-white hover:bg-primary-foreground">
                                            Register Employee
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
