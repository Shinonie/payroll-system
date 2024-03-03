import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { UploadAttendance as CreateAttendance } from '@/api/services/hr/Attendance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Label } from '@radix-ui/react-label';

export function UploadAttendance() {
    const [file, setFile] = useState(null);

    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const { mutate } = useMutation({
        mutationFn: CreateAttendance,
        onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
            toast({
                title: 'Update Attendance',
                description: 'Attendance successfully update'
            });
        }
    });

    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', e.target.file.files[0]);

        if (file) {
            mutate(formData);
            // console.log('Selected file:', file);
            setFile(null);
        } else {
            alert('Please select a file');
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Upload Attendance</Button>
            </DialogTrigger>
            <DialogContent className="max-sm::max-w-[425px] w-full bg-primary-foreground">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-accent-foreground">
                        Upload
                    </DialogTitle>
                    <DialogDescription className="text-accent-foreground">
                        Remember: The uploading of attendances from biometrics is every end of the
                        day or before start of TIME IN, to avoid errors on attendances of employee{' '}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="fileInput">Choose File:</Label>
                        <Input
                            type="file"
                            accept=".csv"
                            name="file"
                            id="fileInput"
                            onChange={handleFileChange}
                        />
                    </div>
                    <DialogFooter>
                        <Button className="bg-primary text-white my-5" type="submit">
                            Upload Attendances
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
