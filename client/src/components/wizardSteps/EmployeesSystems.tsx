import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  employeeCount: z.string().optional().transform(val => val ? parseInt(val) : null),
  digitalSystems: z.array(z.string()),
  otherSystemText: z.string().optional(),
});

type EmployeesSystemsProps = {
  initialData: {
    employeeCount: number | null;
    digitalSystems: string[];
    otherSystemDetails: string;
  };
  onComplete: (data: {
    employeeCount: number | null;
    digitalSystems: string[];
    otherSystemDetails: string;
  }) => void;
};

export default function EmployeesSystems({ initialData, onComplete }: EmployeesSystemsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(
    initialData.digitalSystems.includes("other")
  );

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeCount: initialData.employeeCount?.toString() || "",
      digitalSystems: initialData.digitalSystems,
      otherSystemText: initialData.otherSystemDetails || "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      onComplete({
        employeeCount: values.employeeCount,
        digitalSystems: values.digitalSystems,
        otherSystemDetails: values.otherSystemText || "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save employee information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (checked: boolean, value: string) => {
    const currentValues = form.getValues().digitalSystems;
    
    if (checked) {
      form.setValue("digitalSystems", [...currentValues, value]);
      if (value === "other") {
        setShowOtherInput(true);
      }
    } else {
      form.setValue(
        "digitalSystems",
        currentValues.filter(val => val !== value)
      );
      if (value === "other") {
        setShowOtherInput(false);
        form.setValue("otherSystemText", "");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Employees & Systems</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="employeeCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Employees</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label className="block text-sm font-medium text-gray-700">Digital Systems Used</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="crm"
                    checked={form.getValues().digitalSystems.includes("crm")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "crm")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="crm" className="font-medium text-gray-700">CRM System</Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="erp"
                    checked={form.getValues().digitalSystems.includes("erp")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "erp")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="erp" className="font-medium text-gray-700">ERP System</Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="ecommerce"
                    checked={form.getValues().digitalSystems.includes("ecommerce")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "ecommerce")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="ecommerce" className="font-medium text-gray-700">E-Commerce Platform</Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="accounting"
                    checked={form.getValues().digitalSystems.includes("accounting")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "accounting")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="accounting" className="font-medium text-gray-700">Accounting Software</Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="other-system"
                    checked={form.getValues().digitalSystems.includes("other")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "other")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="other-system" className="font-medium text-gray-700">Other</Label>
                  {showOtherInput && (
                    <FormField
                      control={form.control}
                      name="otherSystemText"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="mt-1"
                              placeholder="Please specify"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

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
