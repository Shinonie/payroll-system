import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreatePayroll, GetPayrollPreview } from '@/api/services/admin/Payroll';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '../ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import Preloader from '../Preloader';

const PayrollPreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { mutate: createPayroll } = useMutation({
        mutationFn: CreatePayroll,
        onSuccess: () => {
            toast({
                title: 'Payroll',
                description: 'Payroll successfully created'
            });
            navigate(-1);
        }
    });

    const { isLoading, isError, data } = useQuery({
        queryFn: () => GetPayrollPreview(id),
        queryKey: [`preview-${id}`]
    });

    useEffect(() => {
        if (isError) {
            navigate(-1);
            toast({
                variant: 'destructive',
                title: 'Payroll Preview',
                description:
                    'Payroll Preview is not available, due to no existing present attendance.'
            });
        }
    }, [isError]);

    if (isLoading || !data) {
        return <Preloader />;
    }

    return (
        <div className="w-full p-10">
            <div>
                <h1 className="text-3xl font-semibold mb-1">Payroll Details</h1>
            </div>
            <div className="flex flex-col flex-wrap">
                <div className="flex justify-between flex-wrap">
                    <div>
                        <h1 className="font-semibold flex items-center flex-wrap gap-5">
                            <span>
                                Payroll will create on:{' '}
                                {data?.payrollPreview?.dateCreated.split('T')[0]}
                            </span>
                        </h1>
                        <h1 className="font-semibold">
                            Payroll Period:{' '}
                            {`${data?.payrollPreview?.dateRange.split(' ')[0].split('T')[0]} to ${data?.payrollPreview?.dateRange.split(' ')[1].split('T')[0]}`}
                        </h1>
                        <h1 className="font-semibold flex items-center flex-wrap gap-5">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="w-full mt-1 text-white hover:bg-primary-foreground">
                                        Create Payroll
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-foreground">
                                            This actions will create a new payroll of employee.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="text-white hover:bg-accent"
                                            onClick={() =>
                                                createPayroll({
                                                    employeeID: data?.payrollPreview?.employeeID
                                                })
                                            }>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </h1>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between mt-5">
                    <div className="text-lg">
                        <h1>Employee ID: {data?.payrollPreview?.employeeID}</h1>
                        <h1>Name: {data?.payrollPreview?.fullname.toUpperCase()}</h1>
                        <h1>Basic Pay: &#8369; {data?.payrollPreview?.montlySalaryRate}</h1>
                        <h1>Hourly Rate: &#8369; {data?.payrollPreview?.hourlyRate}</h1>
                    </div>
                    <div className="text-lg">
                        <h1>Gross Pay: &#8369; {data?.payrollPreview?.totalGrossPay}</h1>
                        <h1>Net Pay: &#8369; {data?.payrollPreview?.totalNetPay}</h1>
                        <h1>Days Working: {data?.payrollPreview?.totalDaysPresent}</h1>
                        <h1>Overtime Hours: {data?.payrollPreview?.overtimeHours}</h1>
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
                                {data?.payrollPreview?.incentives
                                    ? data?.payrollPreview?.incentives
                                    : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">ALLOWANCE</TableCell>
                            <TableCell className="text-center">
                                &#8369;{' '}
                                {data?.payrollPreview?.allowance
                                    ? data?.payrollPreview?.allowance
                                    : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">OVERTIME</TableCell>
                            <TableCell className="text-center">
                                &#8369;{' '}
                                {data?.payrollPreview?.overtimePay
                                    ? data?.payrollPreview?.overtimePay
                                    : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                TOTAL
                            </TableCell>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                &#8369;{' '}
                                {data?.payrollPreview?.allowance +
                                    data?.payrollPreview?.incentives +
                                    data?.payrollPreview?.overtimePay}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            {/* {filteredPayroll[0]?.deduction && (
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
            )} */}
            {data?.payrollPreview?.employeeAdjustment && (
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
                                    {
                                        data?.payrollPreview?.employeeAdjustment[0].adjustment.attendance?.timeIn.split(
                                            'T'
                                        )[0]
                                    }
                                </TableCell>
                                <TableCell className="text-center">
                                    {data?.payrollPreview?.employeeAdjustment[0].adjustment?.type}
                                </TableCell>
                                <TableCell className="text-center">
                                    {
                                        data?.payrollPreview?.employeeAdjustment[0].adjustment
                                            ?.workHours
                                    }
                                </TableCell>
                                <TableCell className="text-center">
                                    &#8369;{' '}
                                    {data?.payrollPreview?.employeeAdjustment[0].adjustment
                                        ?.workHours * data?.payrollPreview?.hourlyRate}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold"></TableCell>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold"></TableCell>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                    TOTAL ADJUSTMENT
                                </TableCell>
                                <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                    &#8369;{' '}
                                    {data?.payrollPreview?.employeeAdjustment[0].adjustment
                                        ?.workHours * data?.payrollPreview?.hourlyRate}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default PayrollPreview;
