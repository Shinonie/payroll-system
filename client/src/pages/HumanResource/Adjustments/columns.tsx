import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
        accessorKey: 'payrollID',
        header: 'Payroll ID',
        cell: ({ row }: any) => <div className="capitalize">{row.original.payrollID}</div>
    },
    {
        accessorKey: 'fullname',
        header: 'Full Name',
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
        accessorKey: 'adjustmentType',
        header: 'TYPE',
        cell: ({ row }: any) => <div className="capitalize">{row.original.adjustment.type}</div>
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
    }
];
