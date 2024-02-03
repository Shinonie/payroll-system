import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

const Payroll = () => {
    return (
        <div className="w-full p-10">
            <div>
                <h1 className="text-3xl font-semibold mb-1">Payroll Details</h1>
            </div>
            <div className="flex flex-col flex-wrap">
                <div className="flex justify-between flex-wrap">
                    <h1 className="font-semibold">Payroll ID: #2316056</h1>
                    <h1 className="font-semibold flex items-center flex-wrap gap-5">
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
                <div className="flex flex-wrap justify-between mt-5">
                    <div className="text-lg">
                        <h1>Employee ID: 123456798</h1>
                        <h1>Name: Sarah Mae Barbasa</h1>
                        <h1>Basic Pay: &#8369; 15,000</h1>
                        <h1>Hourly Rate: 80</h1>
                    </div>
                    <div className="text-lg">
                        <h1>Gross Pay: &#8369; 15,000</h1>
                        <h1>Net Pay: &#8369; 15,000</h1>
                        <h1>Hourly Rate: 80</h1>
                        <h1>Days Working: 15</h1>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <Table>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[150px] text-center">EARNINGS</TableHead>
                            <TableHead className="w-[150px] text-center">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-accent-foreground ">
                        <TableRow>
                            <TableCell className="text-center">INCENTIVES</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">ALLOWANCE</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">RESTDAY</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">OVERTIME</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">REGULAR LEAVE</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">SICK LEAVE</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">VACATION LEAVE</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">MATERNAL LEAVE</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                TOTAL
                            </TableCell>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                &#8369; 1,200
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="mt-10">
                <Table>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[150px] text-center">Deduction</TableHead>
                            <TableHead className="w-[150px] text-center">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-accent-foreground ">
                        <TableRow>
                            <TableCell className="text-center">SSS</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">PAG IBIG</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">PHILHEALT</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">SSS LOAN</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">PAG IBIG LOAM</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">IN COME TAX</TableCell>
                            <TableCell className="text-center">&#8369; 200</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                TOTAL DEDUCTION
                            </TableCell>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                &#8369; 1,200
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Payroll;
