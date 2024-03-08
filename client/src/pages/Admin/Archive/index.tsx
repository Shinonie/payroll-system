import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { GetAllArchiveEmployees } from '@/api/services/admin/Employee';

const Archive = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllArchiveEmployees,
        queryKey: ['archive']
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">ARCHIVE EMPLOYEES</h1>
            </div>
            <DataTable data={data} columns={columns} filter="email" />
        </div>
    );
};

export default Archive;
