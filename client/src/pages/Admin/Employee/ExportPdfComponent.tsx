import React, { useState } from 'react';
import { ExportSdkClient } from '@exportsdk/client';

const ExportPdfComponent = () => {
    const [loading, setLoading] = useState(false);

    const renderPdf = async () => {
        setLoading(true);
        try {
            const client = new ExportSdkClient('test_fbee66a8-688f-4539-bb76-6ed0f5857736');
            const templateId = 'f3f0530d-1784-404f-9cfb-28deb0abea46';
            const templateData = {
                SSSContribution: '5000',
                SSSLoan: '2000',
                adjustmentAmount: '1000',
                allowance: '2000',
                deduction: '1500',
                expensesTotal: '3000',
                fullname: 'John Doe',
                grosspay: '25000',
                incentives: '1000',
                incomeTax: '5000',
                overtime: '3000',
                pagibigContribution: '2000',
                pagibigLoan: '1500',
                philhealth: '1500',
                type: 'Regular',
                workhours: '160'
            };

            const response = await client.renderPdf(templateId, templateData);
            const binary = arrayBufferToBase64(response.data); // Convert ArrayBuffer to base64 string

            downloadPdf(binary);
        } catch (error) {
            console.error('Error rendering PDF:', error);
            // Handle error, maybe show an error message to the user
        } finally {
            setLoading(false);
        }
    };

    // Function to convert ArrayBuffer to base64
    function arrayBufferToBase64(buffer: any) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // Function to trigger the download
    function downloadPdf(data: any) {
        const blob = base64ToBlob(data);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated_pdf.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to convert base64 to blob
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
        <div>
            <button onClick={renderPdf} disabled={loading}>
                Generate PDF
            </button>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default ExportPdfComponent;
