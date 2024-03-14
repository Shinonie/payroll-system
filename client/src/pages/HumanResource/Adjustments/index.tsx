import { DataTable } from '@/components/DataTable';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { GetAllAdjustment } from '@/api/services/hr/Adjustment';
import Preloader from '@/components/Preloader';

const AdjustmentHR = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllAdjustment,
        queryKey: ['adjustment']
    });

    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">ADJUSTMENTS OF EMPLOYEE</h1>
            </div>
            <DataTable data={data} columns={columns} filter="payrollID" />
        </div>
    );
};

export default AdjustmentHR;
