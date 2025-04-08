import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema
const formSchema = z.object({
  revenueCurrent: z.string().optional().transform(val => val ? parseFloat(val) : null),
  revenuePrevious: z.string().optional().transform(val => val ? parseFloat(val) : null),
  revenueTwoYearsAgo: z.string().optional().transform(val => val ? parseFloat(val) : null),
  ebitda: z.string().optional().transform(val => val ? parseFloat(val) : null),
  netMargin: z.string().optional().transform(val => val ? parseFloat(val) : null),
});

type FinancialInfoProps = {
  initialData: {
    revenueCurrent: number | null;
    revenuePrevious: number | null;
    revenueTwoYearsAgo: number | null;
    ebitda: number | null;
    netMargin: number | null;
  };
  onComplete: (data: {
    revenueCurrent: number | null;
    revenuePrevious: number | null;
    revenueTwoYearsAgo: number | null;
    ebitda: number | null;
    netMargin: number | null;
  }) => void;
};

export default function FinancialInfo({ initialData, onComplete }: FinancialInfoProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      revenueCurrent: initialData.revenueCurrent?.toString() || "",
      revenuePrevious: initialData.revenuePrevious?.toString() || "",
      revenueTwoYearsAgo: initialData.revenueTwoYearsAgo?.toString() || "",
      ebitda: initialData.ebitda?.toString() || "",
      netMargin: initialData.netMargin?.toString() || "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      onComplete({
        revenueCurrent: values.revenueCurrent,
        revenuePrevious: values.revenuePrevious,
        revenueTwoYearsAgo: values.revenueTwoYearsAgo,
        ebitda: values.ebitda,
        netMargin: values.netMargin,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save financial information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Revenue (Last 3 Years)</FormLabel>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="mr-2 w-24 text-sm text-gray-500">Current Year:</span>
                <div className="relative rounded-md w-full">
                  <FormField
                    control={form.control}
                    name="revenueCurrent"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">€</span>
                            </div>
                            <Input
                              {...field}
                              type="number"
                              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder="0.00"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2 w-24 text-sm text-gray-500">Previous Year:</span>
                <div className="relative rounded-md w-full">
                  <FormField
                    control={form.control}
                    name="revenuePrevious"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">€</span>
                            </div>
                            <Input
                              {...field}
                              type="number"
                              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder="0.00"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="mr-2 w-24 text-sm text-gray-500">2 Years Ago:</span>
                <div className="relative rounded-md w-full">
                  <FormField
                    control={form.control}
                    name="revenueTwoYearsAgo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">€</span>
                            </div>
                            <Input
                              {...field}
                              type="number"
                              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder="0.00"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="ebitda"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EBITDA (Current Year)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <Input
                      {...field}
                      type="number"
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="netMargin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Net Profit Margin (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="number"
                      className="block w-full rounded-md border-gray-300 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="0.00"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Next"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
