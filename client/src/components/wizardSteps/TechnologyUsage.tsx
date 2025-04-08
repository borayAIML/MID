import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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
  transformationLevel: z.number().min(1).max(5),
  technologiesUsed: z.array(z.string()),
  techInvestmentPercentage: z.string().optional().transform(val => val ? parseFloat(val) : null),
});

type TechnologyUsageProps = {
  initialData: {
    transformationLevel: number;
    technologiesUsed: string[];
    techInvestmentPercentage: number | null;
  };
  onComplete: (data: {
    transformationLevel: number;
    technologiesUsed: string[];
    techInvestmentPercentage: number | null;
  }) => void;
};

export default function TechnologyUsage({ initialData, onComplete }: TechnologyUsageProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transformationLevel: initialData.transformationLevel,
      technologiesUsed: initialData.technologiesUsed,
      techInvestmentPercentage: initialData.techInvestmentPercentage?.toString() || "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      onComplete({
        transformationLevel: values.transformationLevel,
        technologiesUsed: values.technologiesUsed,
        techInvestmentPercentage: values.techInvestmentPercentage,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save technology information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (checked: boolean, value: string) => {
    const currentValues = form.getValues().technologiesUsed;
    
    if (checked) {
      form.setValue("technologiesUsed", [...currentValues, value]);
    } else {
      form.setValue(
        "technologiesUsed",
        currentValues.filter(val => val !== value)
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Technology Usage</h2>
      <p className="text-sm text-gray-600 mb-6">Tell us about the technology used in your business operations.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              Rate your company's digital transformation level:
            </Label>
            <FormField
              control={form.control}
              name="transformationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="px-2">
                      <Slider
                        defaultValue={[field.value]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(values) => field.onChange(values[0])}
                        className="py-4"
                      />
                    </div>
                  </FormControl>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">Beginning</span>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-6 h-6 rounded-full flex items-center justify-center 
                          ${level <= field.value ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          {level}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">Advanced</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Which technologies do you currently use?
            </Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="erp-tech"
                    checked={form.getValues().technologiesUsed.includes("erp")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "erp")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="erp-tech" className="font-medium text-gray-700">
                    Enterprise Resource Planning (ERP)
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="ecom-tech"
                    checked={form.getValues().technologiesUsed.includes("ecommerce")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "ecommerce")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="ecom-tech" className="font-medium text-gray-700">
                    E-Commerce Platform
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="crm-tech"
                    checked={form.getValues().technologiesUsed.includes("crm")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "crm")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="crm-tech" className="font-medium text-gray-700">
                    Customer Relationship Management (CRM)
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="ai-tech"
                    checked={form.getValues().technologiesUsed.includes("ai")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "ai")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="ai-tech" className="font-medium text-gray-700">
                    Artificial Intelligence (AI)
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="cloud-tech"
                    checked={form.getValues().technologiesUsed.includes("cloud")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "cloud")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="cloud-tech" className="font-medium text-gray-700">
                    Cloud Services
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="automation-tech"
                    checked={form.getValues().technologiesUsed.includes("automation")}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, "automation")}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="automation-tech" className="font-medium text-gray-700">
                    Process Automation
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="techInvestmentPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What percentage of revenue do you invest in technology annually?
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="number"
                      step="0.1"
                      className="block w-full rounded-md border-gray-300 pr-12"
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
