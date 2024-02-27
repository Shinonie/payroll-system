import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { GetUserAttendance } from '@/api/services/employee/Attendance';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

const Attendance = () => {
    const userId = useUserStore().userId;

    const [attendanceData, setAttendanceData] = useState([]);
    const [haveError, setHaveError] = useState(false);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const attendance = await GetUserAttendance(userId);
                setAttendanceData(attendance);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };
        fetchAttendance();
    }, [userId]);

    useEffect(() => {
        // Check if any item in attendanceData has null values
        const hasNullValues = attendanceData.some(
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
    }, [attendanceData]);

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
            <div>
                <Table>
                    <TableCaption className="text-primary">List of attendance</TableCaption>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[150px]">Date</TableHead>
                            <TableHead className="w-[150px]">Time In</TableHead>
                            <TableHead className="w-[150px]">Break In</TableHead>
                            <TableHead className="w-[150px]">Break Out</TableHead>
                            <TableHead className="w-[150px]">Time Out</TableHead>
                            <TableHead className="w-[150px]">Overtime In</TableHead>
                            <TableHead className="w-[150px]">Overtime Out</TableHead>
                            <TableHead className="w-[150px]">Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-accent-foreground ">
                        {attendanceData?.map((item: any, index: any) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {new Date(item.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell
                                    className={`${item.time.timeIn == null ? 'bg-red-200 text-red-700' : ''}`}>
                                    {item.time.timeIn
                                        ? item.time.timeIn.substring(11, 19)
                                        : 'ERROR'}
                                </TableCell>
                                <TableCell
                                    className={`${item.time.breakIn == null ? 'bg-red-200 text-red-700' : ''}`}>
                                    {item.time.breakIn
                                        ? item.time.breakIn.substring(11, 19)
                                        : 'ERROR'}
                                </TableCell>
                                <TableCell
                                    className={`${item.time.breakOut == null ? 'bg-red-200 text-red-700' : ''}`}>
                                    {item.time.breakOut
                                        ? item.time.breakOut.substring(11, 19)
                                        : 'ERROR'}
                                </TableCell>
                                <TableCell
                                    className={`${item.time.timeOut == null ? 'bg-red-200 text-red-700' : ''}`}>
                                    {item.time.timeOut
                                        ? item.time.timeOut.substring(11, 19)
                                        : 'ERROR'}
                                </TableCell>
                                <TableCell>
                                    {item.time.overTimeIn
                                        ? item.time.overTimeIn.substring(11, 19)
                                        : 'No Overtime'}
                                </TableCell>
                                <TableCell>
                                    {item.time.overTimeIn
                                        ? item.time.overTimeOut.substring(11, 19)
                                        : 'No Overtime'}
                                </TableCell>
                                <TableCell
                                    className={`${item.remarks == 'ERROR' ? 'bg-red-200 text-red-700' : ''}`}>
                                    {item.remarks}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Attendance;
