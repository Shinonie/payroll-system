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
import { useQuery } from '@tanstack/react-query';
import { GetUserPayroll } from '@/api/services/employee/payroll';
import { useUserStore } from '@/store/useUserStore';
import { useState, useEffect } from 'react';

const Payroll = () => {
    const employeeID = useUserStore().userId;
    const employeeName = useUserStore().fullname;
    const [selectedValue, setSelectedValue] = useState('');
    const [filteredPayroll, setFilteredPayroll] = useState<any[]>([]);
    const [totalIncentive, setTotalIncentive] = useState(0);
    const [adjustmentDate, setAdjustmentDate] = useState('');

    const { data } = useQuery({
        queryFn: () => GetUserPayroll(employeeID),
        queryKey: ['payroll']
    });

    useEffect(() => {
        if (data) {
            const filtered = data.filter(
                (item: any) => item?.payroll?.dateCreated === selectedValue
            );

            setFilteredPayroll(filtered);

            const totalIncentiveValue =
                filtered[0]?.payroll?.incentives + filtered[0]?.payroll?.allowance;
            setTotalIncentive(totalIncentiveValue);

            if (
                filteredPayroll[0]?.adjustment?.adjustment?.attendance?.timeIn &&
                filteredPayroll[0]?.adjustment?.adjustment?.attendance?.timeOut
            ) {
                const createdAtDate = new Date(
                    filteredPayroll[0]?.adjustment?.adjustment?.attendance?.timeIn
                );
                const formattedDate = createdAtDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
                setAdjustmentDate(formattedDate);
            }
        }
    }, [data, selectedValue, totalIncentive, adjustmentDate]);

    if (!data) {
        console.log('Schedule data is still loading or undefined');
        return null; // loading indicator
    }

    return (
        <div className="w-full p-10">
            <div>
                <h1 className="text-3xl font-semibold mb-1">Payroll Details</h1>
            </div>
            <div className="flex flex-col flex-wrap">
                <div className="flex justify-between flex-wrap">
                    <h1 className="font-semibold">
                        Payroll ID: # {filteredPayroll[0]?.payroll?._id}
                    </h1>
                    <h1 className="font-semibold flex items-center flex-wrap gap-5">
                        <span>Payroll Created: </span>
                        <Select onValueChange={(e) => setSelectedValue(e)}>
                            <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Select Date" />
                            </SelectTrigger>
                            <SelectContent>
                                {data?.map((item: any, index: number) => {
                                    const createdAtDate = new Date(item?.payroll?.dateCreated);
                                    const formattedDate = createdAtDate.toLocaleDateString(
                                        'en-US',
                                        {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }
                                    );

                                    return (
                                        <SelectItem value={item?.payroll?.dateCreated} key={index}>
                                            {formattedDate}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </h1>
                </div>
                <div className="flex flex-wrap justify-between mt-5">
                    <div className="text-lg">
                        <h1>Employee ID: {employeeID}</h1>
                        <h1>Name: {employeeName.toUpperCase()}</h1>
                        <h1>Basic Pay: &#8369; {filteredPayroll[0]?.payroll?.montlySalaryRate}</h1>
                        <h1>Hourly Rate: &#8369; {filteredPayroll[0]?.payroll?.hourlyRate}</h1>
                    </div>
                    <div className="text-lg">
                        <h1>Gross Pay: &#8369; {filteredPayroll[0]?.payroll?.totalGrossPay}</h1>
                        <h1>Net Pay: &#8369; {filteredPayroll[0]?.payroll?.totalNetPay}</h1>
                        <h1>Days Working: {filteredPayroll[0]?.payroll?.totalDaysPresent}</h1>
                        <h1>Overtime Hours: {filteredPayroll[0]?.payroll?.overtimeHours}</h1>
                        <h1>
                            Payroll Period:{' '}
                            {`${filteredPayroll[0]?.payroll?.dateRange.split(' ')[0].split('T')[0]} to ${filteredPayroll[0]?.payroll?.dateRange.split(' ')[1].split('T')[0]}`}
                        </h1>
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
                            <TableCell className="text-center">
                                &#8369;{' '}
                                {filteredPayroll[0]?.payroll?.incentives
                                    ? filteredPayroll[0]?.payroll?.incentives
                                    : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">ALLOWANCE</TableCell>
                            <TableCell className="text-center">
                                &#8369;{' '}
                                {filteredPayroll[0]?.payroll?.allowance
                                    ? filteredPayroll[0]?.payroll?.allowance
                                    : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">OVERTIME</TableCell>
                            <TableCell className="text-center">
                                &#8369;{' '}
                                {filteredPayroll[0]?.payroll?.overtimePay
                                    ? filteredPayroll[0]?.payroll?.overtimePay
                                    : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                TOTAL
                            </TableCell>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                &#8369; {totalIncentive ? totalIncentive : '0.00'}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            {filteredPayroll[0]?.deduction && (
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
                                <TableCell className="text-center">
                                    &#8369; {filteredPayroll[0]?.deduction?.SSS}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-center">PAG IBIG</TableCell>
                                <TableCell className="text-center">
                                    &#8369; {filteredPayroll[0]?.deduction?.Pagibig}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-center">PHILHEALTH</TableCell>
                                <TableCell className="text-center">
                                    &#8369; {filteredPayroll[0]?.deduction?.PhilHealth}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-center">SSS LOAN</TableCell>
                                <TableCell className="text-center">
                                    &#8369; {filteredPayroll[0]?.deduction?.SSSLoan}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-center">PAG IBIG LOAM</TableCell>
                                <TableCell className="text-center">
                                    &#8369; {filteredPayroll[0]?.deduction?.PagibigLoan}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-center">INCOME TAX</TableCell>
                                <TableCell className="text-center">
                                    &#8369; {filteredPayroll[0]?.deduction?.IncomeTax}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                    TOTAL DEDUCTION
                                </TableCell>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                    &#8369; {filteredPayroll[0]?.payroll?.totalDeductions}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}
            {filteredPayroll[0]?.adjustment && (
                <div className="mt-10">
                    <h1 className="font-semibold py-5 text-xl">ADJUSTMENT</h1>
                    <Table>
                        <TableHeader className="bg-primary-foreground">
                            <TableRow>
                                <TableHead className="w-[150px] text-center">DATE</TableHead>
                                <TableHead className="w-[150px] text-center">TYPE</TableHead>
                                <TableHead className="w-[150px] text-center">Work Hours</TableHead>
                                <TableHead className="w-[150px] text-center">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-accent-foreground ">
                            <TableRow>
                                <TableCell className="text-center">
                                    {filteredPayroll[0]?.adjustment?.adjustment?.attendance
                                        ?.timeIn &&
                                        filteredPayroll[0]?.adjustment?.adjustment?.attendance
                                            ?.timeOut &&
                                        adjustmentDate}
                                </TableCell>
                                <TableCell className="text-center">
                                    {filteredPayroll[0]?.adjustment?.adjustment?.type}
                                </TableCell>
                                <TableCell className="text-center">
                                    {filteredPayroll[0]?.adjustment?.adjustment?.workHours}
                                </TableCell>
                                <TableCell className="text-center">
                                    &#8369;{' '}
                                    {filteredPayroll[0]?.adjustment?.adjustment?.workHours *
                                        filteredPayroll[0]?.payroll?.hourlyRate}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold"></TableCell>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold"></TableCell>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                    TOTAL DEDUCTION
                                </TableCell>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                    &#8369;{' '}
                                    {filteredPayroll[0]?.adjustment?.adjustment?.workHours *
                                        filteredPayroll[0]?.payroll?.hourlyRate}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default Payroll;
