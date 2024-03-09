import { DataTable } from '@/components/DataTable';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { GetAllLeave } from '@/api/services/admin/Leaves';

const LeavesAdmin = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllLeave,
        queryKey: ['leaves']
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const pendingData = data.filter((item: any) => item.status === 'PENDING');

    const nonPendingData = data.filter((item: any) => item.status !== 'PENDING');

    const sortedData = pendingData.concat(nonPendingData);

    console.log(sortedData);
    return (
        <div>
            <h1 className="text-2xl font-semibold">EMPLOYEE LEAVES</h1>
            <DataTable data={sortedData} columns={columns} filter="fullname" />
        </div>
    );
};

export default LeavesAdmin;
