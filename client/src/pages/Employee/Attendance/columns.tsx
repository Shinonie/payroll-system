export const columns = [
    {
        accessorKey: '_id',
        header: 'Attendance ID',
        cell: ({ row }: any) => {
            return <div className="capitalize">{row.getValue('_id')}</div>;
        }
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }: any) => {
            return (
                <div className="capitalize">
                    {new Date(row.getValue('date')).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
            );
        }
    },
    {
        accessorKey: 'timeIn',
        header: 'Time In',
        cell: ({ row }: any) => {
            const data = row.original;
            const timeIn = data.time ? data.time.timeIn : null;
            const className = timeIn === null ? 'bg-red-200 text-red-700' : '';

            return (
                <div className={`capitalize ${className}`}>
                    {timeIn ? timeIn.substring(11, 19) : 'No time'}
                </div>
            );
        }
    },
    {
        accessorKey: 'breakIn',
        header: 'Break In',
        cell: ({ row }: any) => {
            const data = row.original;
            const breakIn = data.time ? data.time.breakIn : null;
            const className = breakIn === null ? 'bg-red-200 text-red-700' : '';

            return (
                <div className={`capitalize ${className}`}>
                    {breakIn ? breakIn.substring(11, 19) : 'No time'}
                </div>
            );
        }
    },
    {
        accessorKey: 'breakOut',
        header: 'Break Out',
        cell: ({ row }: any) => {
            const data = row.original;
            const breakOut = data.time ? data.time.breakOut : null;
            const className = breakOut === null ? 'bg-red-200 text-red-700' : '';

            return (
                <div className={`capitalize ${className}`}>
                    {breakOut ? breakOut.substring(11, 19) : 'No time'}
                </div>
            );
        }
    },
    {
        accessorKey: 'timeOut',
        header: 'Time Out',
        cell: ({ row }: any) => {
            const data = row.original;
            const timeOut = data.time ? data.time.timeOut : null;
            const className = timeOut === null ? 'bg-red-200 text-red-700' : '';

            return (
                <div className={`capitalize ${className}`}>
                    {timeOut ? timeOut.substring(11, 19) : 'No time'}
                </div>
            );
        }
    },
    {
        accessorKey: 'overTimeIn',
        header: 'Overtime In',
        cell: ({ row }: any) => {
            const data = row.original;
            const overTimeIn = data.time ? data.time.overTimeIn : null;
            const className = overTimeIn === null ? 'bg-red-200 text-red-700' : '';

            return (
                <div className={`capitalize ${className}`}>
                    {overTimeIn ? overTimeIn.substring(11, 19) : 'No time'}
                </div>
            );
        }
    },
    {
        accessorKey: 'overTimeOut',
        header: 'Overtime Out',
        cell: ({ row }: any) => {
            const data = row.original;
            const overTimeOut = data.time ? data.time.overTimeOut : null;
            const className = overTimeOut === null ? 'bg-red-200 text-red-700' : '';

            return (
                <div className={`capitalize ${className}`}>
                    {overTimeOut ? overTimeOut.substring(11, 19) : 'No time'}
                </div>
            );
        }
    }
];
