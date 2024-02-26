import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { GetUserSchedule } from '@/api/services/employee/Schedule';
import { useUserStore } from '@/store/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface ScheduleItem {
    range: string;
}

const Schedule = () => {
    const userId = useUserStore().userId;
    const [selectedValue, setSelectedValue] = useState('');
    const [filteredSchedule, setFilteredSchedule] = useState<ScheduleItem[]>([]);

    const { data: scheduleData } = useQuery({
        queryFn: () => GetUserSchedule(userId),
        queryKey: ['schedule']
    });

    useEffect(() => {
        if (scheduleData) {
            const filtered = scheduleData.filter(
                (item: ScheduleItem) => item.range === selectedValue
            );
            setFilteredSchedule(filtered);
        }
    }, [scheduleData, selectedValue]);

    if (!scheduleData) {
        console.log('Schedule data is still loading or undefined');
        return null; // loading indicator
    }

    console.log(scheduleData);
    const uniqueRanges = new Set<string>(); // Explicitly define Set to contain strings
    scheduleData.forEach((item: ScheduleItem) => uniqueRanges.add(item.range));
    const ranges: string[] = Array.from(uniqueRanges);

    const formattedRanges = ranges.map((range, index) => {
        const [startDateString, endDateString] = range.split(' ');
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        const formattedStartDate = startDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        const formattedEndDate = endDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        return (
            <SelectItem key={index} value={range}>
                {`${formattedStartDate} - ${formattedEndDate}`}
            </SelectItem>
        );
    });

    return (
        <div className="w-full p-10">
            <div className="mb-10">
                <h1 className="text-xl">My Schedules</h1>
                <h1 className="text-2xl font-semibold flex flex-wrap gap-5">
                    <span>PERIOD: </span>
                    <Select onValueChange={(e) => setSelectedValue(e)}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>{formattedRanges}</SelectContent>
                    </Select>
                </h1>
            </div>

            <div>
                <Table>
                    <TableCaption className="text-primary">List of Schedule</TableCaption>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[150px]">Date</TableHead>
                            <TableHead className="w-[150px]">Time In</TableHead>
                            <TableHead className="w-[150px]">Break In</TableHead>
                            <TableHead className="w-[150px]">Break Out</TableHead>
                            <TableHead className="w-[150px]">Time Out</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-accent-foreground ">
                        {filteredSchedule.map((scheduleItem: any, index: any) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {new Date(scheduleItem.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>{scheduleItem.timeIn.substring(11, 19)}</TableCell>
                                <TableCell>{scheduleItem.breakIn.substring(11, 19)}</TableCell>
                                <TableCell>{scheduleItem.breakOut.substring(11, 19)}</TableCell>
                                <TableCell>{scheduleItem.timeOut.substring(11, 19)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Schedule;
