import { useState } from 'react';
import { ExportSdkClient } from '@exportsdk/client';
import { PDFDocument } from 'pdf-lib'; // Import PDFDocument from 'pdf-lib'

const ExportPdfComponent = ({ data }: any) => {
    const [loading, setLoading] = useState(false);

    const renderAndCombinePdf = async () => {
        setLoading(true);
        try {
            const client = new ExportSdkClient('test_fbee66a8-688f-4539-bb76-6ed0f5857736');
            const templateId = 'f3f0530d-1784-404f-9cfb-28deb0abea46';

            const combinedPdfBytes = await combinePdfs(data, client, templateId);

            const binary = arrayBufferToBase64(combinedPdfBytes);
            downloadPdf(binary, 'combined_pdf.pdf');
        } catch (error) {
            console.error('Error rendering PDF:', error);
        } finally {
            setLoading(false);
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

    return (
        <div>
            <button onClick={renderAndCombinePdf} disabled={loading}>
                Generate and Combine PDF
            </button>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default ExportPdfComponent;
