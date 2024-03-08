import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { GetAllPayroll } from '@/api/services/admin/Payroll';
import { useQuery } from '@tanstack/react-query';

const PayrollAdmin = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllPayroll,
        queryKey: ['payrolls']
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">EMPLOYEES PAYROLL</h1>
            </div>
            <DataTable data={data} columns={columns} filter="fullname" />
        </div>
    );
};

export default PayrollAdmin;
