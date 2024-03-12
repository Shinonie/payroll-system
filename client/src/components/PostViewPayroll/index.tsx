import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { GetPayrollByID } from '@/api/services/admin/Payroll';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '../ui/use-toast';
import { ExportSdkClient } from '@exportsdk/client';
import { Button } from '../ui/button';
import Preloader from '../Preloader';
import { ReceiptText } from 'lucide-react';

const PayrollPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isLoading, isError, data } = useQuery({
        queryFn: () => GetPayrollByID(id),
        queryKey: [`view-${id}`]
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

    const renderPdf = async () => {
        try {
            const client = new ExportSdkClient('test_fbee66a8-688f-4539-bb76-6ed0f5857736');
            const templateId = 'f3f0530d-1784-404f-9cfb-28deb0abea46';
            const templateData = {
                SSSContribution: data?.deduction?.SSS || 0,
                SSSLoan: data?.deduction?.SSSLoan || 0,
                adjustmentAmount:
                    (data?.adjustment?.adjustment?.workHours ?? 0) *
                    (data?.payroll?.hourlyRate ?? 0),
                allowance: data?.payroll?.allowance,
                deduction: data?.payroll?.totalDeduction,
                fullname: data?.payroll?.employeeID?.fullname,
                grosspay: data?.payroll?.totalGrossPay,
                incentives: data?.payroll?.incentives,
                incomeTax: data?.deduction?.incomeTax || 0,
                overtime: data?.payroll?.overtimeHours * data?.payroll?.hourlyRate,
                pagibigContribution: data?.deduction?.Pagibig || 0,
                pagibigLoan: data?.deduction?.PagibigLoan || 0,
                philhealth: data?.deduction?.PhilHealth || 0,
                type: data?.adjustment?.adjustment?.type,
                workhours: data?.adjustment?.adjustment?.workHours,
                netPay: data?.payroll?.totalNetPay
            };

            const response = await client.renderPdf(templateId, templateData);
            const binary = arrayBufferToBase64(response.data);

            downloadPdf(binary, templateData.fullname);
        } catch (error) {
            console.error('Error rendering PDF:', error);
        }
    };

    function arrayBufferToBase64(buffer: any) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function downloadPdf(data: any, fullname: string) {
        const blob = base64ToBlob(data);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        const currentDate = new Date().toISOString().slice(0, 10);
        const filename = `${fullname}-${currentDate}.pdf`;

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function base64ToBlob(base64: any) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: 'application/pdf' });
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
                                Payroll will create on: {data?.payroll?.dateCreated.split('T')[0]}
                            </span>
                        </h1>
                        <h1 className="font-semibold">
                            Payroll Period:{' '}
                            {`${data?.payroll?.dateRange.split(' ')[0].split('T')[0]} to ${data?.payroll?.dateRange.split(' ')[1].split('T')[0]}`}
                        </h1>
                        <h1 className="font-semibold flex items-center flex-wrap gap-5">
                            <Button
                                className="w-full mt-1 text-white hover:bg-primary-foreground"
                                onClick={renderPdf}>
                                <ReceiptText className="mr-2" />
                                Generate Payslip
                            </Button>
                        </h1>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between mt-5">
                    <div className="text-lg">
                        <h1>Employee ID: {data?.payroll?.employeeID?._id}</h1>
                        <h1>Name: {data?.payroll?.employeeID?.fullname.toUpperCase()}</h1>
                        <h1>Basic Pay: &#8369; {data?.payroll?.montlySalaryRate}</h1>
                        <h1>Hourly Rate: &#8369; {data?.payroll?.hourlyRate}</h1>
                    </div>
                    <div className="text-lg">
                        <h1>Gross Pay: &#8369; {data?.payroll?.totalGrossPay}</h1>
                        <h1>Net Pay: &#8369; {data?.payroll?.totalNetPay}</h1>
                        <h1>Days Working: {data?.payroll?.totalDaysPresent}</h1>
                        <h1>Overtime Hours: {data?.payroll?.overtimeHours}</h1>
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
                                {data?.payroll?.incentives ? data?.payroll?.incentives : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">ALLOWANCE</TableCell>
                            <TableCell className="text-center">
                                &#8369;{' '}
                                {data?.payroll?.allowance ? data?.payroll?.allowance : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center">OVERTIME</TableCell>
                            <TableCell className="text-center">
                                &#8369;{' '}
                                {data?.payroll?.overtimePay ? data?.payroll?.overtimePay : '0.00'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                TOTAL
                            </TableCell>
                            <TableCell className="text-center bg-accent text-accent-foreground font-semibold">
                                &#8369;{' '}
                                {data?.payroll?.allowance +
                                    data?.payroll?.incentives +
                                    data?.payroll?.overtimePay}
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
            {data?.payroll?.employeeAdjustment && (
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
                                        data?.payroll?.employeeAdjustment[0].adjustment.attendance?.timeIn.split(
                                            'T'
                                        )[0]
                                    }
                                </TableCell>
                                <TableCell className="text-center">
                                    {data?.payroll?.employeeAdjustment[0].adjustment?.type}
                                </TableCell>
                                <TableCell className="text-center">
                                    {data?.payroll?.employeeAdjustment[0].adjustment?.workHours}
                                </TableCell>
                                <TableCell className="text-center">
                                    &#8369;{' '}
                                    {data?.payroll?.employeeAdjustment[0].adjustment?.workHours *
                                        data?.payroll?.hourlyRate}
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
                                    {data?.payroll?.employeeAdjustment[0].adjustment?.workHours *
                                        data?.payroll?.hourlyRate}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default PayrollPost;
