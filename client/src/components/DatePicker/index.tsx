import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format, isBefore, differenceInDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DatePickerWithRange({
    className,
    onDateChange,
    onNumberOfSelectedDatesChange // Callback to pass number of selected dates
}: {
    className?: string;
    onDateChange: (date: DateRange) => void;
    onNumberOfSelectedDatesChange: (num: number) => void; // Callback prop
}) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 5)
    });

    const isDateDisabled = (day: Date) => isBefore(day, new Date());

    const getNumberOfSelectedDates = (startDate: Date, endDate: Date) => {
        const daysDifference = differenceInDays(endDate, startDate);
        return daysDifference >= 0 ? daysDifference + 1 : 0;
    };

    React.useEffect(() => {
        if (date !== undefined) {
            onDateChange(date);
            if (date.from && date.to) {
                const numSelectedDates = getNumberOfSelectedDates(date.from, date.to);
                onNumberOfSelectedDatesChange(numSelectedDates); // Call callback with the number of selected dates
            }
        }
    }, [date, onDateChange, onNumberOfSelectedDatesChange]);

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[300px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} -{' '}
                                    {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        disabled={isDateDisabled}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
