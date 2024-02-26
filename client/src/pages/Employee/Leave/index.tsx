import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableCaption,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import { formatISO } from 'date-fns';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CreateLeave, GetUserLeave } from '@/api/services/employee/Leave';
import { useUserStore } from '@/store/useUserStore';

const Leave = () => {
    const [leaveStart, setLeaveStart] = useState('');
    const [leaveEnd, setLeaveEnd] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [status, setStatus] = useState(false);
    const [open, setOpen] = useState(false);

    const employeeID = useUserStore().userId;

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryFn: () => GetUserLeave(employeeID),
        queryKey: ['leave']
    });

    const { mutate } = useMutation({
        mutationFn: CreateLeave,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leave'] });
        }
    });

    const handleDateChange = (date: DateRange) => {
        if (date.from && date.to) {
            setLeaveStart(formatISO(date.from));
            setLeaveEnd(formatISO(date.to));
        }
    };

    const handleSubmit = () => {
        if (leaveStart && leaveEnd && leaveType) {
            console.log('APPROVE');
            setStatus(false);
            setOpen(false);
            setLeaveStart('');
            setLeaveEnd('');
            setLeaveType('');
            const timeDiffence = new Date(leaveEnd).getTime() - new Date(leaveStart).getTime();
            const totalDays = timeDiffence / (1000 * 3600 * 24) + 1;
            mutate({ employeeID, leaveType, startDate: leaveStart, endDate: leaveEnd, totalDays });
        } else {
            console.log('ERROR');
            setStatus(true);
        }
    };

    return (
        <div className="w-full p-10">
            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold mb-1">My list of leaves</h1>
                <h1 className="font-semibold flex items-center gap-5">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger className="bg-primary text-white px-5 py-1 rounded-full text-sm flex items-center gap-2">
                            <Send /> <span>REQUEST LEAVE</span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request Leave</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Select specific date and leave type
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Select Date</Label>
                                    <DatePickerWithRange onDateChange={handleDateChange} />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-right">Select Leave type</Label>
                                    <Select onValueChange={(e) => setLeaveType(e)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sick leave">Sick Leave</SelectItem>
                                            <SelectItem value="vacation leave">
                                                Vacation Leave
                                            </SelectItem>
                                            <SelectItem value="maternal leave">
                                                Maternal Leave
                                            </SelectItem>
                                            <SelectItem value="regular leave">
                                                Regular Leave
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {status && (
                                <h1 className="text-red-500 text-center">Please fill all fields</h1>
                            )}
                            <DialogFooter>
                                <Button
                                    className="w-full text-background bg-accent hover:bg-accent-foreground hover:text-slate-400"
                                    onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </h1>
            </div>

            {/* <div className="flex justify-between mt-5">
                <div className="text-lg">
                    <h1 className="text-xl font-semibold">AVAILABLE LEAVES</h1>
                    <h1>Sick Leave: 8</h1>
                    <h1>Vacation Leave: 8</h1>
                    <h1>Maternal Leave: 30</h1>
                    <h1>Regular Leave: 8</h1>
                </div>
            </div> */}
            <div className="mt-10">
                <Table>
                    <TableCaption className="text-primary">List of Leave requests</TableCaption>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[150px]">Start Date</TableHead>
                            <TableHead className="w-[150px]">End Date</TableHead>
                            <TableHead className="w-[150px]">Leave Type</TableHead>
                            <TableHead className="w-[150px]">Total Days</TableHead>
                            <TableHead className="w-[150px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-accent-foreground ">
                        {data?.map((item: any, index: any) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {new Date(item.startDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>
                                    {new Date(item.endDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell> {item.leaveType}</TableCell>
                                <TableCell> {item.totalDays}</TableCell>
                                <TableCell
                                    className={`${item.status === 'PENDING' ? 'bg-orange-200 text-orange-700' : item.status === 'REJECTED' ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
                                    {item.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Leave;
