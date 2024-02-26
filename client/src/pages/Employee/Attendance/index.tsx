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

    return (
        <div className="w-full p-10">
            <div className="mb-10">
                <h1 className="text-2xl font-semibold">My Daily Attendance</h1>
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
                                <TableCell>{item.time.timeIn.substring(11, 19)}</TableCell>
                                <TableCell>{item.time.breakIn.substring(11, 19)}</TableCell>
                                <TableCell>{item.time.breakOut.substring(11, 19)}</TableCell>
                                <TableCell>
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
