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

const Schedule = () => {
    return (
        <div className="w-full p-10">
            <div className="mb-10">
                <h1 className="text-xl">Schedule ID: #032621</h1>
                <h1 className="text-2xl font-semibold flex flex-wrap gap-5">
                    <span>PERIOD: </span>
                    <Select>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="February 1, 2024 to February 15, 2024" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">
                                January 1, 2024 to February 15, 2024
                            </SelectItem>
                            <SelectItem value="dark">
                                January 16, 2024 to February 31, 2024
                            </SelectItem>
                            <SelectItem value="system">
                                February 1, 2024 to February 15, 2024
                            </SelectItem>
                        </SelectContent>
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
                        <TableRow>
                            <TableCell className="font-medium">February 1, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 2, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 3, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 4, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 5, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 6, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 7, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 8, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 9, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 10, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 1, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 12, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 13, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 14, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">February 15, 2024</TableCell>
                            <TableCell>8:00 AM</TableCell>
                            <TableCell>12:00 PM</TableCell>
                            <TableCell>01:00 PM</TableCell>
                            <TableCell>5:00 PM</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Schedule;
