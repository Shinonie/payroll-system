import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';

export const columns = [
    {
        accessorKey: 'createdAt',
        header: ({ column }: any) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date Created
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
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
        accessorKey: 'payrollID',
        header: ({ column }: any) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Payroll ID
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }: any) => <div className="capitalize">{row.original.payrollID}</div>
    },
    {
        accessorKey: 'fullname',
        header: ({ column }: any) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Full Name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn" alt="@shadcn" />
                    <AvatarFallback>
                        {row.original?.employeeID?.fullname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="capitalize">{row.original?.employeeID?.fullname}</div>
            </div>
        )
    },
    {
        accessorKey: 'adjustmentType',
        header: 'TYPE',
        cell: ({ row }: any) => <div className="capitalize">{row.original.adjustment.type}</div>
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
                className={`capitalize rounded-xl text-center ${row.original.status ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'}`}>
                {row.original.status ? 'ADDED' : 'PROCESSING'}
            </div>
        )
    }
];
