import { Checkbox } from '@/components/ui/checkbox';
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

export const columns = [
    {
        accessorKey: '_id',
        header: 'ID',
        cell: ({ row }: any) => <div className="capitalize">{row.getValue('_id')}</div>
    },
    {
        accessorKey: 'fullname',
        header: 'Full Name',
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn" alt="@shadcn" />
                    <AvatarFallback>
                        {row.original?.employeeID?.fullname?.charAt(0).toLocaleUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="capitalize">{row.original?.employeeID?.fullname}</div>
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
        header: 'Status',
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
                        <DropdownMenuItem>APPROVE</DropdownMenuItem>
                        <DropdownMenuItem>REJECT</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
