import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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

import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { UpdatePayrollStatus } from '@/api/services/admin/Payroll';
import { ExportSdkClient } from '@exportsdk/client';
import { useState } from 'react';

export const columns = [
    {
        accessorKey: 'createdAt',
        accessorFn: (row: any) => row?.payroll?.createdAt,
        header: 'ID',
        cell: ({ row }: any) => (
            <div className="capitalize">
                {new Date(row.getValue('createdAt')).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </div>
        )
    },
    {
        accessorKey: 'fullname',
        accessorFn: (row: any) => row?.payroll?.employeeID?.fullname,
        header: 'Full Name',
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn" alt="@shadcn" />
                    <AvatarFallback>
                        {row.getValue('fullname')?.charAt(0).toLocaleUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="capitalize">{row.getValue('fullname')}</div>
            </div>
        )
    },
    {
        accessorKey: 'totalHours',
        accessorFn: (row: any) => row?.payroll?.totalHours,
        header: 'Total Hours',
        cell: ({ row }: any) => <div className="capitalize">{row.getValue('totalHours')} hours</div>
    },
    {
        accessorKey: 'totalGrossPay',
        accessorFn: (row: any) => row?.payroll?.totalGrossPay,
        header: 'Total Gross Pay',
        cell: ({ row }: any) => (
            <div className="capitalize"> &#8369; {row.getValue('totalGrossPay')}</div>
        )
    },
    {
        accessorKey: 'totalNetPay',
        accessorFn: (row: any) => row?.payroll?.totalNetPay,
        header: 'Total Net Pay',
        cell: ({ row }: any) => (
            <div className="capitalize"> &#8369; {row.getValue('totalNetPay')}</div>
        )
    },
    {
        accessorKey: 'status',
        accessorFn: (row: any) => row?.payroll?.status,
        header: 'Status',
        cell: ({ row }: any) => (
            <div
                className={`capitalize rounded-xl text-center ${row.original.payroll?.status ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'}`}>
                {row.original.payroll?.status ? 'PAID' : 'PENDING '}
            </div>
        )
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }: any) => {
            const data = row.original;

            const queryClient = useQueryClient();

            const [loading, setLoading] = useState(false);
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

            const { mutate } = useMutation({
                mutationFn: UpdatePayrollStatus,
                onMutate: () => {
                    setLoading(true);
                    toast({
                        title: 'PAYROLL',
                        description: 'Payroll Slip is downloading...'
                    });
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['payrolls'] });
                    renderPdf();

                    setTimeout(() => {
                        toast({
                            title: 'Update Attendance',
                            description: 'Attendance successfully updated'
                        });
                        setLoading(false);
                    }, 5000);
                },
                onError: (error) => {
                    console.error('Mutation failed:', error);
                    setLoading(false);
                }
            });

            if (data?.payroll?.status) {
                return null;
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">RELEASE PAYROLL</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-foreground">
                                        This action cannot be undone. This will permanently set the
                                        status paid from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="text-white hover:bg-accent"
                                        onClick={() =>
                                            mutate({
                                                employeeID: data?.payroll?.employeeID._id,
                                                payrollID: data?.payroll?._id
                                            })
                                        }>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
