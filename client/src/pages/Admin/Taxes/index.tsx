import { Form, FormField, FormItem } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { GetAllTaxes, EditTaxes } from '@/api/services/admin/Taxes';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const TaxesSchema = z.object({
    SSS: z.number().min(0.0001, { message: 'This field is required' }),
    PagIbig: z.number().min(1, { message: 'This field is required' }),
    PhilHealth: z.number().min(0.0001, { message: 'This field is required' })
});

const Taxes = () => {
    const { toast } = useToast();

    const queryClient = useQueryClient();

    const { isLoading, data } = useQuery({
        queryFn: GetAllTaxes,
        queryKey: ['taxes']
    });

    const form = useForm<z.infer<typeof TaxesSchema>>({
        resolver: zodResolver(TaxesSchema),
        defaultValues: {
            SSS: 0,
            PagIbig: 0,
            PhilHealth: 0
        }
    });

    const {
        formState: { errors }
    } = form;

    const { mutate } = useMutation({
        mutationFn: EditTaxes,
        onSuccess: () => {
            toast({
                title: 'Taxes',
                description: 'Taxes is successfully updated.'
            });
            queryClient.invalidateQueries({ queryKey: ['employee'] });
        }
    });

    useEffect(() => {
        if (!isLoading && data && data.length > 0) {
            const taxesData = data[0];
            form.reset(taxesData);

            form.setValue('SSS', taxesData.SSS);
            form.setValue('PagIbig', taxesData.PagIbig);
            form.setValue('PhilHealth', taxesData.PhilHealth);
        }
    }, [isLoading, data, form]);

    const onSubmit = (formData: z.infer<typeof TaxesSchema>) => {
        mutate({ id: data[0]._id, data: formData });
    };

    return (
        <div className="h-[70vh] md:flex flex-col gap-5 justify-center items-center">
            <main className="w-full flex justify-center items-center py-1 md:w-2/3 lg:w-3/4 bg-accent rounded-lg">
                <div className="p-2 md:p-4 ">
                    <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg ">
                        <div className="grid max-w-2xl mx-auto">
                            <div className="flex flex-col gap-5">
                                <h2 className="text-xl md:text-3xl font-bold max-sm:mb-2">
                                    CONTRIBUTIONS
                                </h2>
                                <div className="text-white">
                                    <h2 className="font-bold max-sm:mb-2">
                                        Reminder: Please input the decimal value of percentage for
                                        SSS and Philhealth.
                                    </h2>
                                    <h2 className="font-bold max-sm:mb-2">Example: 4% = 0.04</h2>
                                </div>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6 mt-5">
                                        <div className="w-full flex gap-10">
                                            <FormField
                                                control={form.control}
                                                name="SSS"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="SSS"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                Social Security System
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                id="SSS"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="%"
                                                                onChange={(e) => {
                                                                    const parsedValue = parseFloat(
                                                                        e.target.value
                                                                    );
                                                                    field.onChange(parsedValue);
                                                                }}
                                                            />
                                                            {errors.SSS && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.SSS.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="PhilHealth"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="Philhealth"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                PHILHEALTH
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                id="Philhealth"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="%"
                                                                onChange={(e) => {
                                                                    const parsedValue = parseFloat(
                                                                        e.target.value
                                                                    );
                                                                    field.onChange(parsedValue);
                                                                }}
                                                            />
                                                            {errors.PhilHealth && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.PhilHealth.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="PagIbig"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="w-full">
                                                            <Label
                                                                htmlFor="PagIbig"
                                                                className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                                                                PagIbig
                                                            </Label>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                id="PagIbig"
                                                                className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                                                                placeholder="₱"
                                                                onChange={(e) => {
                                                                    const parsedValue = parseFloat(
                                                                        e.target.value
                                                                    );
                                                                    field.onChange(parsedValue);
                                                                }}
                                                            />
                                                            {errors.PagIbig && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {errors.PagIbig.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <Button
                                            type="submit"
                                            className="w-full text-white hover:bg-primary-foreground">
                                            SAVE
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Taxes;
