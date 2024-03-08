import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { toast } from '@/components/ui/use-toast';

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
import { useParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { UpdateAttendance } from '@/api/services/admin/Attendance';
import { useState } from 'react';

const FormSchema = z.object({
    timeIn: z.string().optional(),
    timeOut: z.string().optional(),
    breakIn: z.string().optional(),
    breakOut: z.string().optional(),
    overtimeIn: z.string().optional(),
    overtimeOut: z.string().optional()
});
export const columns = [
    {
        accessorKey: '_id',
        header: 'Attendance ID',
        cell: ({ row }: any) => <div className="capitalize">{row.getValue('_id')}</div>
    },
    {
        accessorKey: 'date',
        header: 'Date',

        cell: ({ row }: any) => (
            <div className="capitalize">
                {new Date(row.getValue('date')).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </div>
        )
    },
    {
        accessorKey: 'timeIn',
        header: 'Time In',
        cell: ({ row }: any) => (
            <div className={`capitalize ${row.getValue('timeIn') === null && 'text-red-700'}`}>
                {row.getValue('timeIn')
                    ? row.getValue('timeIn').substring(11, 19)
                    : 'NOT AVAILABLE'}
            </div>
        )
    },
    {
        accessorKey: 'breakIn',
        header: 'Break In',
        cell: ({ row }: any) => (
            <div className={`capitalize ${row.getValue('breakOut') === null && 'text-red-700'}`}>
                {row.getValue('breakIn')
                    ? row.getValue('breakIn').substring(11, 19)
                    : 'NOT AVAILABLE'}
            </div>
        )
    },
    {
        accessorKey: 'breakOut',
        header: 'Break Out',
        cell: ({ row }: any) => (
            <div className={`capitalize ${row.getValue('breakOut') === null && 'text-red-700'}`}>
                {row.getValue('breakOut')
                    ? row.getValue('breakOut').substring(11, 19)
                    : 'NOT AVAILABLE'}
            </div>
        )
    },
    {
        accessorKey: 'timeOut',
        header: 'Time Out',
        cell: ({ row }: any) => (
            <div className={`capitalize ${row.getValue('timeOut') === null && 'text-red-700'}`}>
                {row.getValue('timeOut')
                    ? row.getValue('timeOut').substring(11, 19)
                    : 'NOT AVAILABLE'}
            </div>
        )
    },
    {
        accessorKey: 'overTimeIn',
        header: 'Overtime In',
        cell: ({ row }: any) => (
            <div className={`capitalize ${row.getValue('overTimeIn') === null && 'bg-red-700'}`}>
                {row.getValue('overTimeIn')
                    ? row.getValue('overTimeIn').substring(11, 19)
                    : 'NOT AVAILABLE'}
            </div>
        )
    },
    {
        accessorKey: 'overTimeOut',
        header: 'Overtime Out',
        cell: ({ row }: any) => (
            <div className={`capitalize ${row.getValue('overTimeOut') === null && 'bg-red-700'}`}>
                {row.getValue('overTimeOut')
                    ? row.getValue('overTimeOut').substring(11, 19)
                    : 'NOT AVAILABLE'}
            </div>
        )
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }: any) => {
            const data = row.original;

            const queryClient = useQueryClient();

            const { id } = useParams();
            const [open, setOpen] = useState(false);

            const { mutate } = useMutation({
                mutationFn: UpdateAttendance,
                onSuccess: () => {
                    setOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['attendance'] });
                    toast({
                        title: 'Update Attendance',
                        description: 'Attendance successfully update'
                    });
                }
            });

            const handleDialogButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation(); // Stop the click event from reaching the dropdown
            };

            const handleDialogContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
                e.stopPropagation(); // Stop the keyboard event from reaching the dropdown
            };

            const handleDialogContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation(); // Stop the click event from reaching the dropdown
            };

            const initialTimeIn = data.timeIn?.slice(11, 16);
            const initialTimeOut = data.timeOut?.slice(11, 16);
            const initialBreakIn = data.breakIn?.slice(11, 16);
            const initialBreakOut = data.breakOut?.slice(11, 16);
            const initialOvertimeIn = data.overtimeIn?.slice(11, 16);
            const initialOvertimeOut = data.overtimeOut?.slice(11, 16);

            const form = useForm<z.infer<typeof FormSchema>>({
                resolver: zodResolver(FormSchema),
                defaultValues: {
                    timeIn: initialTimeIn || '',
                    timeOut: initialTimeOut || '',
                    breakIn: initialBreakIn || '',
                    breakOut: initialBreakOut || '',
                    overtimeIn: initialOvertimeIn || '',
                    overtimeOut: initialOvertimeOut || ''
                }
            });

            function onSubmit(formData: z.infer<typeof FormSchema>) {
                const date = data.date.slice(0, 11);

                const updatedTimeIn = formData.timeIn ? date + formData.timeIn + ':00Z' : '';
                const updatedTimeOut = formData.timeOut ? date + formData.timeOut + ':00Z' : '';
                const updatedBreakIn = formData.breakIn ? date + formData.breakIn + ':00Z' : '';
                const updatedBreakOut = formData.breakOut ? date + formData.breakOut + ':00Z' : '';
                const updatedOvertimeIn = formData.overtimeOut
                    ? date + formData.overtimeOut + ':00Z'
                    : '';
                const updatedOvertimeOut = formData.overtimeOut
                    ? date + formData.overtimeOut + ':00Z'
                    : '';

                const formattedData: Record<string, string> = {
                    timeIn: updatedTimeIn,
                    timeOut: updatedTimeOut,
                    breakIn: updatedBreakIn,
                    breakOut: updatedBreakOut,
                    overtimeIn: updatedOvertimeIn,
                    overtimeOut: updatedOvertimeOut
                };

                mutate({ id, attendance_id: data._id, formattedData });
                toast({
                    title: 'You submitted the following values:',
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">
                                {JSON.stringify(formattedData, null, 2)}
                            </code>
                        </pre>
                    )
                });
            }

            if (data.payrollStatus) {
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
                        <DropdownMenuItem>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" onClick={handleDialogButtonClick}>
                                        Edit Attendance
                                    </Button>
                                </DialogTrigger>
                                <DialogContent
                                    onInteractOutside={(e) => {
                                        e.preventDefault();
                                    }}
                                    className="sm:max-w-[500px]"
                                    onKeyDown={handleDialogContentKeyDown}
                                    onClick={handleDialogContentClick}>
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription className="text-primary">
                                            Make changes to your profile here. Click save when
                                            you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="w-full grid grid-cols-3 gap-6">
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="timeIn"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>TIME IN</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="time"
                                                                    placeholder="shadcn"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="breakIn"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>BREAK IN</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="time"
                                                                    placeholder="shadcn"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="breakOut"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>BREAK OUT</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="time"
                                                                    placeholder="shadcn"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="timeOut"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>TIME OUT</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="time"
                                                                    placeholder="shadcn"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="overtimeIn"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>OVERT TIME IN</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="time"
                                                                    placeholder="shadcn"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="overtimeOut"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>OVERT TIME OUT</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="time"
                                                                    placeholder="shadcn"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <DialogFooter className="col-span-3">
                                                <Button
                                                    className="text-white hover:bg-accent"
                                                    type="submit">
                                                    Save changes
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
