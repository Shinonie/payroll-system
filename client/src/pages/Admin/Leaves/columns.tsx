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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

import { RejectLeave, ApproveLeave } from '@/api/services/hr/Leaves';

export const columns = [
    {
        accessorKey: '_id',
        header: 'ID',
        cell: ({ row }: any) => <div className="capitalize">{row.getValue('_id')}</div>
    },
    {
        accessorKey: 'fullname',
        accessorFn: (row: any) => row.employeeID.fullname,
        header: 'Full Name',
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn" alt="@shadcn" />
                    <AvatarFallback>
                        {row.getValue('fullname').charAt(0).toLocaleUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="capitalize">{row.getValue('fullname')}</div>
            </div>
        )
    },
    {
        accessorKey: 'Leave Type',
        header: 'Leave Type',
        cell: ({ row }: any) => <div className="capitalize">{row.original?.leaveType}</div>
    },
    {
        accessorKey: 'Start Date',
        header: 'Start Date',
        cell: ({ row }: any) => (
            <div className="capitalize">
                {new Date(row.original?.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </div>
        )
    },
    {
        accessorKey: 'End Date',
        header: 'End Date',
        cell: ({ row }: any) => (
            <div className="capitalize">
                {new Date(row.original?.endDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </div>
        )
    },
    {
        accessorKey: 'status',
        header: ({ column }: any) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Status
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }: any) => (
            <div
                className={`capitalize rounded-xl text-center ${
                    row.original.status === 'APPROVE'
                        ? 'bg-green-200 text-green-700'
                        : row.original.status === 'REJECTED'
                          ? 'bg-red-200 text-red-700'
                          : 'bg-orange-200 text-orange-700'
                }`}>
                {row.original.status}
            </div>
        )
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }: any) => {
            const data = row.original;

            const queryClient = useQueryClient();

            const { mutate: approveLeave } = useMutation({
                mutationFn: ApproveLeave,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['leaves'] });
                    toast({
                        title: 'Leave',
                        description: 'Leave successfully approve'
                    });
                }
            });
            const { mutate: rejectLeave } = useMutation({
                mutationFn: RejectLeave,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['leaves'] });
                    toast({
                        title: 'Leave',
                        description: 'Leave successfully rejected'
                    });
                }
            });

            if (data.status === 'APPROVE' || data.status === 'REJECTED') {
                return null;
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
                            <Button
                                variant="outline"
                                className="w-full hover:bg-green-200 hover:text-green-700"
                                onClick={() => approveLeave(data._id)}>
                                APPROVE
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button
                                variant="outline"
                                className="w-full hover:bg-red-200 hover:text-red-700"
                                onClick={() => rejectLeave(data._id)}>
                                REJECT
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
