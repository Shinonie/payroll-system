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
                        <DropdownMenuItem>Create Payroll</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
