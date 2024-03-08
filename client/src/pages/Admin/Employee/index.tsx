import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { UploadAttendance } from '@/components/UploadAttendance';
import { GetAllEmployees } from '@/api/services/admin/Employee';

const EmployeeAdmin = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllEmployees,
        queryKey: ['employees']
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">ALL EMPLOYEES</h1>
                <UploadAttendance />
                {/* <ExportPdfComponent /> */}
            </div>
            <DataTable data={data} columns={columns} filter="email" />
        </div>
    );
};

export default EmployeeAdmin;
