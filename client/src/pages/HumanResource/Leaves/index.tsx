import { DataTable } from '@/components/DataTable';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { GetAllLeave } from '@/api/services/hr/Leaves';
import Preloader from '@/components/Preloader';

const LeavesHR = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllLeave,
        queryKey: ['leaves']
    });

    if (isLoading) {
        return <Preloader />;
    }

    const pendingData = data.filter((item: any) => item.status === 'PENDING');

    const nonPendingData = data.filter((item: any) => item.status !== 'PENDING');

    const sortedData = pendingData.concat(nonPendingData);

    return (
        <div>
            <h1 className="text-2xl font-semibold">EMPLOYEE LEAVES</h1>
            <DataTable data={sortedData} columns={columns} filter="fullname" />
        </div>
    );
};

export default LeavesHR;
