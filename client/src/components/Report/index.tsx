import csvDownload from 'json-to-csv-export';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';

const GenerateReport = ({ data }: any) => {
    const filteredData = data.map((entry: any) => ({
        ID: entry.payroll._id,
        DateCreated: entry.payroll.dateCreated,
        DateRange: entry.payroll.dateRange,
        EmployeeID: entry.payroll.employeeID.id,
        Firstname: entry.payroll.employeeID.firstName,
        Middlename: entry.payroll.employeeID.middleName,
        Lastname: entry.payroll.employeeID.lastName,
        TotalHours: entry.payroll.totalHours,
        TotalDaysPresent: entry.payroll.totalDaysPresent,
        HourlyRate: entry.payroll.hourlyRate,
        TotalDeduction: entry.payroll.totalDeductions,
        Grosspay: entry.payroll.totalGrossPay,
        TotalNetPay: entry.payroll.totalNetPay
    }));

    const totalNetPaySum = filteredData.reduce(
        (acc: any, entry: any) => acc + entry.TotalNetPay,
        0
    );

    const totalRow: any = {
        ID: '',
        DateCreated: '',
        DateRange: '',
        EmployeeID: '',
        Firstname: '',
        Middlename: '',
        Lastname: '',
        TotalHours: '',
        TotalDaysPresent: '',
        HourlyRate: '',
        TotalDeduction: '',
        Grosspay: 'Total',
        TotalNetPay: totalNetPaySum
    };
    filteredData.push(totalRow);

    const dataToConvert = {
        data: filteredData,
        filename: 'payroll_report',
        delimiter: ',',
        headers: Object.keys(filteredData[0])
    };

    return (
        <Button
            className="w-full text-white hover:bg-primary-foreground"
            onClick={() => csvDownload(dataToConvert)}>
            <Download className="mr-2" />
            Download Payroll Report
        </Button>
    );
};

export default GenerateReport;
