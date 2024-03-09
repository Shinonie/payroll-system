import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { useQuery, useMutation } from '@tanstack/react-query';
import { UploadAttendance } from '@/components/UploadAttendance';
import { GetAllEmployees } from '@/api/services/admin/Employee';
import { CreateBulkPayroll } from '@/api/services/admin/Payroll';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { HandCoins } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

const EmployeeAdmin = () => {
    const { isLoading, data } = useQuery({
        queryFn: GetAllEmployees,
        queryKey: ['employees']
    });

    const { mutate } = useMutation({
        mutationFn: CreateBulkPayroll,
        onSuccess: () => {
            toast({
                title: 'Leave',
                description: 'Leave successfully approve'
            });
        },
        onError: (err: any) => {
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: err.response.data.message
            });
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold">ALL EMPLOYEES</h1>
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                    <UploadAttendance />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full text-white hover:bg-primary-foreground">
                                <HandCoins className="mr-2" />
                                Create Bulk Payroll
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-foreground">
                                    This actions will create a new payroll of ALL employees.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="text-white hover:bg-accent"
                                    onClick={() => mutate()}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <DataTable data={data} columns={columns} filter="email" />
        </div>
    );
};

export default EmployeeAdmin;
