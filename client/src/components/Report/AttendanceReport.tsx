import csvDownload from 'json-to-csv-export';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { GetAttendanceReport } from '@/api/services/admin/Attendance';

interface AttendanceEntry {
    _id: string;
    fullname: string;
    date: string;
    employeeID: string;
    time: {
        timeIn: string;
        breakIn: string;
        breakOut: string;
        timeOut: string;
        overTimeIn: string;
        overTimeOut: string;
    };
    status: string;
}

const AttendanceReport: React.FC = () => {
    const handleDownload = async () => {
        try {
            const data = await GetAttendanceReport();

            handleExportToCSV(data);
        } catch (error) {
            console.error('Error fetching attendance report:', error);
        }
    };

    const handleExportToCSV = (data: AttendanceEntry[] | null) => {
        if (data) {
            const filteredData = data.map((entry) => ({
                AttendanceID: entry._id,
                BiometricID: entry.employeeID,
                Fullname: entry.fullname,
                Date: entry.date,
                TimeIn: entry.time.timeIn,
                BreakIn: entry.time.breakIn,
                BreakOut: entry.time.breakOut,
                TimeOut: entry.time.timeOut,
                OvertimeIn: entry.time.overTimeIn,
                OvertimeOut: entry.time.overTimeOut,
                Status: entry.status
            }));

            const dataToConvert = {
                data: filteredData,
                filename: 'attendance_report',
                delimiter: ',',
                headers: Object.keys(filteredData[0])
            };

            csvDownload(dataToConvert);
        }
    };

    return (
        <Button className="w-full text-white hover:bg-primary-foreground" onClick={handleDownload}>
            <Download className="mr-2" />
            Download Attendance Report
        </Button>
    );
};

export default AttendanceReport;
