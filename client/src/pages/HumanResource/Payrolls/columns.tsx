import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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

import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { UpdatePayrollStatus } from '@/api/services/hr/Payroll';

export const columns = [
    {
        accessorKey: 'createdAt',
        header: 'ID',
        cell: ({ row }: any) => (
            <div className="capitalize">
                {new Date(row.getValue('createdAt')).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </div>
        )
    },
    {
        accessorKey: 'fullname',
        accessorFn: (row: any) => row?.employeeID?.fullname,
        header: 'Full Name',
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn" alt="@shadcn" />
                    <AvatarFallback>
                        {row.getValue('fullname')?.charAt(0).toLocaleUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="capitalize">{row.getValue('fullname')}</div>
            </div>
        )
    },
    {
        accessorKey: 'totalHours',
        header: 'Total Hours',
        cell: ({ row }: any) => <div className="capitalize">{row.getValue('totalHours')} hours</div>
    },
    {
        accessorKey: 'totalGrossPay',
        header: 'Total Gross Pay',
        cell: ({ row }: any) => (
            <div className="capitalize"> &#8369; {row.getValue('totalGrossPay')}</div>
        )
    },
    {
        accessorKey: 'totalNetPay',
        header: 'Total Net Pay',
        cell: ({ row }: any) => (
            <div className="capitalize"> &#8369; {row.getValue('totalNetPay')}</div>
        )
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: any) => (
            <div
                className={`capitalize rounded-xl text-center ${row.original.status ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'}`}>
                {row.original.status ? 'PAID' : 'Pending'}
            </div>
        )
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }: any) => {
            const data = row.original;

            const queryClient = useQueryClient();

            const { mutate } = useMutation({
                mutationFn: UpdatePayrollStatus,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['payrolls'] });
                    toast({
                        title: 'Update Attendance',
                        description: 'Attendance successfully update'
                    });
                }
            });

            if (data.status) {
                return null; // If status is true, don't render actions
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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">RELEASE PAYROLL</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-foreground">
                                        This action cannot be undone. This will permanently set the
                                        status paid from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="text-white hover:bg-accent"
                                        onClick={() =>
                                            mutate({
                                                employeeID: data.employeeID._id,
                                                payrollID: data._id
                                            })
                                        }>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
