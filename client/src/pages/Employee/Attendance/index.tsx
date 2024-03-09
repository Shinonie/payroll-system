import { GetUserAttendance } from '@/api/services/employee/Attendance';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
const Attendance = () => {
    const userId = useUserStore().userId;

    const { data } = useQuery({
        queryFn: () => GetUserAttendance(userId),
        queryKey: ['attendance']
    });

    const [haveError, setHaveError] = useState(false);

    console.log(data);
    useEffect(() => {
        // Check if any item in attendanceData has null values
        const hasNullValues = data?.some(
            (item: any) =>
                item &&
                item.time &&
                (item.time.timeIn === null ||
                    item.time.breakIn === null ||
                    item.time.breakOut === null ||
                    item.time.timeOut === null ||
                    item.remarks === 'ERROR')
        );

        // Set haveError state based on the presence of null values
        setHaveError(hasNullValues);
    }, [data]);

    if (!data) {
        return <div>Loading</div>;
    }
    return (
        <div className="w-full p-10">
            <div className="mb-10">
                <h1 className="text-2xl font-semibold">My Daily Attendance</h1>
                {haveError && (
                    <p className="text-red-700 mt-5">
                        NOTICE: There's an error on your attendance, please go to Human Resources
                        Office or Admin Officce. Anything changes on your attendance will add to
                        your adjustment payroll, this adjustment will appear on your next payroll.
                        Thank you!.
                    </p>
                )}
            </div>
            <DataTable data={data} columns={columns} filter="_id" />
        </div>
    );
};

export default Attendance;
