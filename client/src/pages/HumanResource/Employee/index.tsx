import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { UploadAttendance } from '@/components/UploadAttendance';
import { GetAllEmployees } from '@/api/services/hr/Employee';

const EmployeeHR = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllEmployees,
        queryKey: ['employees']
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    console.log(data);

    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">ALL EMPLOYEES</h1>
                    <h1 className="text-xl font-semibold">
                        You may create PAYROLL and UPLOAD ATTENDANCE HERE
                    </h1>
                </div>
                <UploadAttendance />
            </div>
            <DataTable data={data} columns={columns} filter="email" />
        </div>
    );
};

export default EmployeeHR;
