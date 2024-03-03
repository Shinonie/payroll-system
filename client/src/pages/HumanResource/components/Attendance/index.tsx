import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { GetAttendance } from '@/api/services/hr/Attendance';
import { useParams } from 'react-router-dom';

const Attendances = () => {
    const { id } = useParams();

    const { isLoading, data } = useQuery({
        queryFn: () => GetAttendance(id),
        queryKey: ['attendance']
    });

    if (isLoading) {
        return <div>LOADING</div>;
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
                    _id: entry?._id
                }))}
                filter="date"
                columns={columns}
            />
        </div>
    );
};

export default Attendances;
