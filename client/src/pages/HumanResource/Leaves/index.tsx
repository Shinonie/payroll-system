import { DataTable } from '@/components/DataTable';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { GetAllLeave } from '@/api/services/hr/Leaves';

const LeavesHR = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllLeave,
        queryKey: ['leaves']
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <DataTable data={data} columns={columns} filter="fullname" />
        </div>
    );
};

export default LeavesHR;
