import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { GetAllPayroll } from '@/api/services/hr/Payroll';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import BulkPaySlip from '@/components/BulkPayroll';
import GenerateReport from '@/components/Report';

const PayrollHR = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllPayroll,
        queryKey: ['payrolls']
    });

    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (data) {
            const filteredPayrolls = data.filter((item: any) => !item.payroll.status);
            setFilteredData(filteredPayrolls);
        }
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const templateDataArray = (filteredData as any[]).map((item) => ({
        SSSContribution: item.deduction?.SSS || 0,
        SSSLoan: item.deduction?.SSSLoan || 0,
        adjustmentAmount:
            (item.adjustment?.adjustment?.workHours ?? 0) * (item.payroll?.hourlyRate ?? 0),
        allowance: item.payroll?.allowance,
        deduction: item.payroll?.totalDeduction,
        fullname: item.payroll?.employeeID?.fullname,
        grosspay: item.payroll?.totalGrossPay,
        incentives: item.payroll?.incentives,
        incomeTax: item.deduction?.incomeTax || 0,
        overtime: item.payroll?.overtimeHours * item.payroll?.hourlyRate,
        pagibigContribution: item.deduction?.Pagibig || 0,
        pagibigLoan: item.deduction?.PagibigLoan || 0,
        philhealth: item.deduction?.PhilHealth || 0,
        type: item.adjustment?.adjustment?.type,
        workhours: item.payroll?.overtimeHours + item.payroll?.totalHours,
        netPay: item.payroll?.totalNetPay,
        employeeID: item.payroll?.employeeID,
        payrollID: item.payroll?._id
    }));

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">EMPLOYEES PAYROLL</h1>
                <div className="flex gap-5">
                    <GenerateReport data={data} />
                    <BulkPaySlip data={templateDataArray} />
                </div>
            </div>
            <DataTable data={data} columns={columns} filter="fullname" />
        </div>
    );
};

export default PayrollHR;
