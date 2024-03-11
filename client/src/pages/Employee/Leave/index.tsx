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
import { useToast } from '@/components/ui/use-toast';

const constantLeaves: any = {
    SICK_LEAVE: {
        no_of_days: 15
    },
    VACATION_LEAVE: {
        no_of_days: 15
    },
    FORCED_MANDATORY_LEAVE: {
        no_of_days: 5
    },
    SPECIAL_PRIVILEGE_LEAVE_PARENTAL_SOLO_PARENT_LEAVE: {
        no_of_days: 3
    },
    REHABILITATION_LEAVE: {
        no_of_days: 7
    },
    STUDY_LEAVE: {
        no_of_days: 105
    },
    TERMINAL_LEAVE: {
        no_of_days: 5
    },
    SPECIAL_EMERGENCY_LEAVE: {
        no_of_days: 7
    },
    PATERNAL_LEAVE: {
        no_of_days: 105
    },
    MATERNAL_LEAVE: {
        no_of_days: 210
    },
    VIOLENCE_AGAINST_WOMEN_AND_CHILDREN_ACT_LEAVE: {
        no_of_days: 10
    },
    SPECIAL_LEAVE_FOR_WOMEN_GYNAECOLOGICAL_DISORDER: {
        no_of_days: 60
    },
    LEAVE_FOR_GOOD: {
        no_of_days: 5
    }
};

const Leave = () => {
    const [leaveStart, setLeaveStart] = useState('');
    const [leaveEnd, setLeaveEnd] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [status, setStatus] = useState(false);
    const [open, setOpen] = useState(false);
    const [numberOfSelectedDates, setNumberOfSelectedDates] = useState(0);
    const { toast } = useToast();

    const employeeID = useUserStore().userId;

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryFn: () => GetUserLeave(employeeID),
        queryKey: ['leave']
    });

    const { mutate } = useMutation({
        mutationFn: CreateLeave,
        onSuccess: () => {
            toast({
                title: 'Leave Request',
                description: 'Leave has been submitted successfully'
            });
            queryClient.invalidateQueries({ queryKey: ['leave'] });
        },
        onError: (error) => {
            console.log(error);
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description:
                    'Failed to submit leave request, because you have existing or pending application. Please try again later.'
            });
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
            const selectedLeaveType = constantLeaves[leaveType];
            const { no_of_days } = selectedLeaveType;

            if (numberOfSelectedDates <= no_of_days) {
                setStatus(false);
                setOpen(false);
                setLeaveStart('');
                setLeaveEnd('');
                setLeaveType('');
                const timeDiffence = new Date(leaveEnd).getTime() - new Date(leaveStart).getTime();
                const totalDays = timeDiffence / (1000 * 3600 * 24) + 1;
                mutate({
                    employeeID,
                    leaveType,
                    startDate: leaveStart,
                    endDate: leaveEnd,
                    totalDays
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: `Failed to submit leave request. You have only ${no_of_days} days for this leave type`
                });
            }
        } else {
            console.log('ERROR');
            setStatus(true);
            // You can show a toast message here indicating the error
        }
    };

    const handleNumberOfSelectedDatesChange = (num: number) => {
        setNumberOfSelectedDates(num);
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
                                    <DatePickerWithRange
                                        onNumberOfSelectedDatesChange={
                                            handleNumberOfSelectedDatesChange
                                        }
                                        onDateChange={handleDateChange}
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-right">Select Leave type</Label>
                                    <Select onValueChange={(e) => setLeaveType(e)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                                            <SelectItem value="VACATION_LEAVE">
                                                Vacation Leave
                                            </SelectItem>
                                            <SelectItem value="MATERNAL_LEAVE">
                                                Maternal Leave
                                            </SelectItem>
                                            <SelectItem value="PATERNAL_LEAVE">
                                                Parental Leave
                                            </SelectItem>
                                            <SelectItem value="SPECIAL_PRIVILEGE_LEAVE_PARENTAL_SOLO_PARENT_LEAVE">
                                                Special Privilege Leave (Parental Solo Parent Leave)
                                            </SelectItem>
                                            <SelectItem value="REHABILITATION_LEAVE">
                                                Rehabilitation Leave
                                            </SelectItem>
                                            <SelectItem value="STUDY_LEAVE">Study Leave</SelectItem>
                                            <SelectItem value="TERMINAL_LEAVE">
                                                Terminal Leave
                                            </SelectItem>
                                            <SelectItem value="SPECIAL_EMERGENCY_LEAVE">
                                                Special Emergency Leave
                                            </SelectItem>
                                            <SelectItem value="VIOLENCE_AGAINST_WOMEN_AND_CHILDREN_ACT_LEAVE">
                                                Leave for Violence Against Women and Children Act
                                            </SelectItem>
                                            <SelectItem value="SPECIAL_LEAVE_FOR_WOMEN_GYNAECOLOGICAL_DISORDER">
                                                Special Leave for Women (Gynaecological Disorder)
                                            </SelectItem>
                                            <SelectItem value="LEAVE_FOR_GOOD">
                                                Leave for Good
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
                                    className={`${item.status === 'PROCESSING' ? 'bg-orange-200 text-orange-700' : item.status === 'REJECTED' ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
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
