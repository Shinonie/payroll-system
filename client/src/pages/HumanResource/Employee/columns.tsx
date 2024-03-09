import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { toast } from '@/components/ui/use-toast';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
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
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { CreatePayroll } from '@/api/services/hr/Payroll';
import { useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Link } from 'react-router-dom';
import { EditUserProfile } from '@/api/services/employee/Employee';

const FormSchema = z.object({
    SSSLoan: z.number().optional(),
    PagibigLoan: z.number().optional(),
    hourlyRate: z.number().optional(),
    incentives: z.number().optional(),
    allowance: z.number().optional()
});

export const columns = [
    {
        accessorKey: '_id',
        header: 'ID',
        cell: ({ row }: any) => <div className="capitalize">{row.getValue('_id')}</div>
    },
    {
        accessorKey: 'employment date',
        header: 'Employment Date',
        cell: ({ row }: any) => {
            const data = row.original;
            return (
                <div className="capitalize">
                    {new Date(data.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
            );
        }
    },
    {
        accessorKey: 'email',
        header: ({ column }: any) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Email
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }: any) => <div className="lowercase">{row.getValue('email')}</div>
    },
    {
        accessorKey: 'fullname',
        header: 'Full Name',
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn" alt="@shadcn" />
                    <AvatarFallback>
                        {row.original?.fullname?.charAt(0).toLocaleUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="capitalize">{row.getValue('fullname')}</div>
            </div>
        )
    },
    {
        accessorKey: 'birthday',
        header: 'Birthday',
        cell: ({ row }: any) => (
            <div className="capitalize">
                {new Date(row.getValue('birthday')).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </div>
        )
    },
    {
        accessorKey: 'gender',
        header: 'Gender',
        cell: ({ row }: any) => <div className="capitalize">{row.getValue('gender')}</div>
    },
    {
        header: 'Actions',
        id: 'actions',
        enableHiding: false,
        cell: ({ row }: any) => {
            const data = row.original;

            const queryClient = useQueryClient();

            const [open, setOpen] = useState(false);

            const { mutate: createPayroll } = useMutation({
                mutationFn: CreatePayroll,
                onSuccess: () => {
                    setOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['payrolls'] });
                    toast({
                        title: 'Payroll',
                        description: 'Payroll successfully created'
                    });
                },
                onError: () => {
                    setOpen(false);
                    toast({
                        variant: 'destructive',
                        title: 'Payroll',
                        description:
                            'Payroll is not available, due to existing payroll or no present attendance.'
                    });
                }
            });

            const handleDialogButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link to={`/admin/attendance/${data._id}`}>View Attendance</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to={`/admin/schedule/${data._id}`}>View Schedules</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleDialogButtonClick}>
                                        Create Payroll
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-foreground">
                                            This actions will create a new payroll of employee. You
                                            may view the details of payroll
                                            <Link
                                                to={`/human-resource/payroll/${data._id}`}
                                                className="underline font-bold ml-1">
                                                here.
                                            </Link>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="text-white hover:bg-accent"
                                            onClick={() =>
                                                createPayroll({
                                                    employeeID: data?.controlNumber
                                                })
                                            }>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    },
    {
        header: 'Extras',
        cell: ({ row }: any) => {
            const data = row.original;

            const [open, setOpen] = useState(false);

            const { mutate } = useMutation({
                mutationFn: EditUserProfile,
                onSuccess: () => {
                    setOpen(false);
                    toast({
                        title: 'Successfully',
                        description: 'Details updated'
                    });
                },
                onError: () => {
                    setOpen(false);
                    toast({
                        title: 'Failed to update',
                        description: 'Something went wrong'
                    });
                }
            });

            const handleDialogButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation(); // Stop the click event from reaching the dropdown
            };

            const handleDialogContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
                e.stopPropagation(); // Stop the keyboard event from reaching the dropdown
            };

            const handleDialogContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation(); // Stop the click event from reaching the dropdown
            };

            const form = useForm<z.infer<typeof FormSchema>>({
                resolver: zodResolver(FormSchema),
                defaultValues: {
                    SSSLoan: data.SSSLoan || 0,
                    PagibigLoan: data.PagibigLoan || 0,
                    hourlyRate: data.hourlyRate || 0,
                    incentives: data.incentives || 0,
                    allowance: data.allowance || 0
                }
            });

            function onSubmit(formData: z.infer<typeof FormSchema>) {
                const { SSSLoan, PagibigLoan, hourlyRate, incentives, allowance } = formData;

                mutate({
                    employeeID: data.controlNumber,
                    data: {
                        SSSLoan,
                        PagibigLoan,
                        hourlyRate,
                        incentives,
                        allowance
                    }
                });
            }

            return (
                <div className="capitalize">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleDialogButtonClick}>
                                EDIT
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                            className="sm:max-w-[500px]"
                            onKeyDown={handleDialogContentKeyDown}
                            onClick={handleDialogContentClick}>
                            <DialogHeader>
                                <DialogTitle>EDIT DATA FOR PAYROLL</DialogTitle>
                                <DialogDescription className="text-primary">
                                    Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="w-full grid grid-cols-3 gap-6">
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name="SSSLoan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SSS LOAN</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter here..."
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = parseFloat(
                                                                    e.target.value
                                                                );

                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        {form.formState.errors.SSSLoan?.message}
                                    </div>
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name="PagibigLoan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Pagibig Loan</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter here..."
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = parseFloat(
                                                                    e.target.value
                                                                );

                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name="hourlyRate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Rate per Hour</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter here..."
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = parseFloat(
                                                                    e.target.value
                                                                );

                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name="incentives"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Incentives</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter here..."
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = parseFloat(
                                                                    e.target.value
                                                                );

                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name="allowance"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ALLOWANCE</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter here..."
                                                            {...field}
                                                            onChange={(e) => {
                                                                const value = parseFloat(
                                                                    e.target.value
                                                                );

                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <DialogFooter className="col-span-3">
                                        <Button
                                            className="text-white hover:bg-accent"
                                            type="submit">
                                            SAVE
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        }
    }
];
