import { DataTable } from '@/components/DataTable';
import { columns } from './columns';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { GetScheduleByEmployee } from '@/api/services/hr/Schedules';
import { useParams } from 'react-router-dom';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { CalendarPlus2 } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreateSchedule } from '@/api/services/admin/Schedules';
import Preloader from '@/components/Preloader';

const FormSchema = z.object({
    date: z.string().optional(),
    timeIn: z.string().optional(),
    timeOut: z.string().optional(),
    breakIn: z.string().optional(),
    breakOut: z.string().optional()
});

const ScheduleAdnin = () => {
    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: CreateSchedule,
        onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            toast({
                title: 'Update Attendance',
                description: 'Attendance successfully update'
            });
        }
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            date: '',
            timeIn: '',
            timeOut: '',
            breakIn: '',
            breakOut: ''
        }
    });

    function onSubmit(formData: z.infer<typeof FormSchema>) {
        const date = formData.date && formData.date.slice(0, 11);

        const updatedTimeIn = formData.timeIn ? date + formData.timeIn + ':00Z' : '';
        const updatedTimeOut = formData.timeOut ? date + formData.timeOut + ':00Z' : '';
        const updatedBreakIn = formData.breakIn ? date + formData.breakIn + ':00Z' : '';
        const updatedBreakOut = formData.breakOut ? date + formData.breakOut + ':00Z' : '';

        const formattedData: Record<string, string> = {
            employeeID: id || '',
            date: formData.date || '',
            timeIn: updatedTimeIn,
            timeOut: updatedTimeOut,
            breakIn: updatedBreakIn,
            breakOut: updatedBreakOut
        };

        mutate([formattedData]);

        toast({
            title: 'Schedule',
            description: 'Schedule successfully created'
        });
    }

    const { isLoading, data } = useQuery({
        queryFn: () => GetScheduleByEmployee(id),
        queryKey: ['schedules']
    });

    if (isLoading) {
        return <Preloader />;
    }
    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold">Employee Schedule</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-primary text-white gap-2">
                            <CalendarPlus2 />
                            Create Schedule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex gap-1 items-center">
                                <CalendarPlus2 />
                                Create Schedule
                            </DialogTitle>
                            <DialogDescription className="text-primary">
                                Enter the schedule to create
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-full grid grid-cols-3 gap-6">
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>DATE</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full pl-3 text-left font-normal'
                                                                )}>
                                                                {field.value ? (
                                                                    format(field.value, 'PPP')
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0"
                                                        align="start">
                                                        <Calendar
                                                            mode="single"
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    const dateString =
                                                                        date?.toString();
                                                                    const parsedDate = parse(
                                                                        dateString,
                                                                        "EEE MMM dd yyyy HH:mm:ss 'GMT'XX '(Singapore Standard Time)'",
                                                                        new Date()
                                                                    );
                                                                    const isoString = format(
                                                                        parsedDate,
                                                                        "yyyy-MM-dd'T'HH:mm:ss'Z'"
                                                                    );

                                                                    field.onChange(isoString);
                                                                }
                                                            }}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )}
                                    />
                                </div>
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

                                <DialogFooter className="col-span-3">
                                    <Button className="text-white hover:bg-accent" type="submit">
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable data={data} filter="date" columns={columns} />
        </div>
    );
};

export default ScheduleAdnin;
