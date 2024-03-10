import { useState } from 'react';
import { ExportSdkClient } from '@exportsdk/client';
import { PDFDocument } from 'pdf-lib';
import { Button } from '../ui/button';
import { ReceiptText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePayrollStatus } from '@/api/services/admin/Payroll';

const BulkPaySlip = ({ data }: any) => {
    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

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
            renderAndCombinePdf();
        },
        onError: (error) => {
            console.error('Mutation failed:', error);
            setLoading(false);
        }
    });

    const renderAndCombinePdf = async () => {
        setLoading(true);
        try {
            const client = new ExportSdkClient('test_fbee66a8-688f-4539-bb76-6ed0f5857736');
            const templateId = 'f3f0530d-1784-404f-9cfb-28deb0abea46';

            const combinedPdfBytes = await combinePdfs(data, client, templateId);

            const binary = arrayBufferToBase64(combinedPdfBytes);
            downloadPdf(binary, 'Employees Payslip.pdf');
        } catch (error) {
            console.error('Error rendering PDF:', error);
        } finally {
            setLoading(false);

            queryClient.invalidateQueries({ queryKey: ['payrolls'] });

            toast({
                title: 'Payslip',
                description: 'Payslip successfully created'
            });
        }
    };

    async function combinePdfs(templateDataArray: any, client: any, templateId: any) {
        const pdfDoc = await PDFDocument.create();

        for (let i = 0; i < templateDataArray.length; i++) {
            const templateData = templateDataArray[i];
            const response = await client.renderPdf(templateId, templateData);
            const pagePdfBytes = response.data;
            const page = await PDFDocument.load(pagePdfBytes);
            const [copiedPage] = await pdfDoc.copyPages(page, [0]);
            pdfDoc.addPage(copiedPage);
        }

        return await pdfDoc.save();
    }

    function arrayBufferToBase64(buffer: any) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function downloadPdf(data: any, filename: any) {
        const blob = base64ToBlob(data);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
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

    const handleGeneratePayslips = () => {
        try {
            if (data.length === 0) {
                toast({
                    variant: 'destructive',
                    title: 'Payslips',
                    description: 'Payroll Slip is unavailable'
                });
            }
            for (const item of data) {
                mutate({
                    employeeID: item.employeeID._id,
                    payrollID: item.payrollID
                });
            }
        } catch (error) {
            console.error('Error generating payslips:', error);
        }
    };

    return (
        <div>
            <Button
                className="w-full text-white hover:bg-primary-foreground"
                onClick={handleGeneratePayslips}
                disabled={loading || data.length === 0}>
                <ReceiptText className="mr-2" />
                {loading ? <p>Loading...</p> : 'Generate All Payslip'}
            </Button>
        </div>
    );
};

export default BulkPaySlip;
