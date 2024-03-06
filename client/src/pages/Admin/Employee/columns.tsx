import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { toast } from '@/components/ui/use-toast';

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

const FormSchema = z.object({
    SSSLoan: z.string().optional(),
    PagibigLoan: z.string().optional(),
    hourlyRate: z.string().optional(),
    incentives: z.string().optional(),
    allowance: z.string().optional()
});

export const columns = [
    {
        accessorKey: '_id',
        header: 'ID',
        cell: ({ row }: any) => <div className="capitalize">{row.getValue('_id')}</div>
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
        id: 'actions',
        enableHiding: false,
        cell: ({ row }: any) => {
            const data = row.original;

            const queryClient = useQueryClient();

            const [open, setOpen] = useState(false);

            const { mutate } = useMutation({
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
                    SSSLoan: '',
                    PagibigLoan: '',
                    hourlyRate: '',
                    incentives: '',
                    allowance: ''
                }
            });

            function onSubmit(formData: z.infer<typeof FormSchema>) {
                const { SSSLoan, PagibigLoan, hourlyRate, incentives, allowance } = formData;

                mutate({
                    employeeID: data._id,
                    SSSLoan,
                    PagibigLoan,
                    hourlyRate,
                    incentives,
                    allowance
                });
                toast({
                    title: 'You submitted the following values:',
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{JSON.stringify(formData, null, 2)}</code>
                        </pre>
                    )
                });
            }

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
                            <Link to={`/human-resource/attendance/${data._id}`}>
                                View Attendance
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to={`/human-resource/schedule/${data._id}`}>View Schedules</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" onClick={handleDialogButtonClick}>
                                        Create Payroll
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
                                        <DialogTitle>Create Payroll</DialogTitle>
                                        <DialogDescription className="text-primary">
                                            Make payroll to employee here. Click save when you're
                                            done.
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
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
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
                                                    Create Payroll
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
