import { GetUserAttendance } from '@/api/services/employee/Attendance';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import Preloader from '@/components/Preloader';

const Attendance = () => {
    const userId = useUserStore().userId;

    const { data, error, isLoading }: any = useQuery({
        queryFn: async () => GetUserAttendance(userId),
        queryKey: ['attendance']
    });

    const [haveError, setHaveError] = useState(false);

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
        setHaveError(hasNullValues || !!error);
    }, [data, error]);

    if (isLoading) {
        return <Preloader />;
    }

    if (error || error?.status === 404) {
        // Handle error here, for example:
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <h1 className="text-4xl font-bold">No Attendance</h1>
            </div>
        );
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
