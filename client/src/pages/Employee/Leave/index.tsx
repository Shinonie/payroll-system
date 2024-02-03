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

const Leave = () => {
    return (
        <div className="w-full p-10">
            <div className="flex justify-between">
                <h1 className="text-3xl font-semibold mb-1">Leave Details</h1>
                <h1 className="font-semibold flex items-center gap-5">
                    <Dialog>
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
                                    <DatePickerWithRange />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label className="text-right">Select Leave type</Label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Leave" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sick leave">Sick Leave</SelectItem>
                                            <SelectItem value="vacation leave">
                                                Vacation Leave
                                            </SelectItem>
                                            <SelectItem value="marternal leave">
                                                Maternal Leave
                                            </SelectItem>
                                            <SelectItem value="regular leave">
                                                Regular Leave
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    className="w-full text-background bg-accent hover:bg-accent-foreground hover:text-slate-400"
                                    type="submit">
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </h1>
            </div>

            <div className="flex justify-between mt-5">
                <div className="text-lg">
                    <h1 className="text-xl font-semibold">AVAILABLE LEAVES</h1>
                    <h1>Sick Leave: 8</h1>
                    <h1>Vacation Leave: 8</h1>
                    <h1>Maternal Leave: 30</h1>
                    <h1>Regular Leave: 8</h1>
                </div>
            </div>
            <div className="mt-10">
                <Table>
                    <TableCaption className="text-primary">List of Leave requests</TableCaption>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[150px]">Start Date</TableHead>
                            <TableHead className="w-[150px]">End Date</TableHead>
                            <TableHead className="w-[150px]">Leave Type</TableHead>
                            <TableHead className="w-[150px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-accent-foreground ">
                        <TableRow>
                            <TableCell className="font-medium">December 8, 2023</TableCell>
                            <TableCell>December 14, 2023</TableCell>
                            <TableCell>SICK LEAVE</TableCell>
                            <TableCell className="bg-green-200 text-green-700">ACCEPTED</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">December 8, 2023</TableCell>
                            <TableCell>December 14, 2023</TableCell>
                            <TableCell>SICK LEAVE</TableCell>
                            <TableCell className="bg-red-200 text-red-700">REJECTED</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">December 8, 2023</TableCell>
                            <TableCell>December 14, 2023</TableCell>
                            <TableCell>SICK LEAVE</TableCell>
                            <TableCell className="bg-orange-200 text-orange-700">PENDING</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Leave;
