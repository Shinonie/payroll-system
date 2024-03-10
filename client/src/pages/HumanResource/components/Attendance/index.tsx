import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { GetAttendance } from '@/api/services/hr/Attendance';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

const Attendances = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoading, data, isError } = useQuery({
        queryFn: () => GetAttendance(id),
        queryKey: [`attendance-${id}`]
    });

    useEffect(() => {
        if (isError) {
            navigate(-1);
            toast({
                variant: 'destructive',
                title: 'Attendance',
                description: 'Attendance is not available or no present attendance.'
            });
        }
    }, [isError]);

    if (isLoading || !data) {
        return <div>Loading</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold">Employee Attendance</h1>
            <DataTable
                data={data?.map((entry: any) => ({
                    breakIn: entry?.time?.breakIn,
                    breakOut: entry?.time?.breakOut,
                    date: entry?.date,
                    timeIn: entry?.time?.timeIn,
                    timeOut: entry?.time?.timeOut,
                    payrollStatus: entry?.payrollStatus,
                    _id: entry?._id
                }))}
                filter="date"
                columns={columns}
            />
        </div>
    );
};

export default Attendances;
