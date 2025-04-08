import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  intent: z.string().min(1, "Please select your primary intention"),
  exitTimeline: z.string().min(1, "Please select your timeline"),
  idealOutcome: z.string().optional(),
  valuationExpectations: z.string().optional().transform(val => val ? parseFloat(val) : null),
});

type OwnerIntentProps = {
  initialData: {
    intent: string;
    exitTimeline: string;
    idealOutcome: string;
    valuationExpectations: number | null;
  };
  onComplete: (data: {
    intent: string;
    exitTimeline: string;
    idealOutcome: string;
    valuationExpectations: number | null;
  }) => void;
};

export default function OwnerIntent({ initialData, onComplete }: OwnerIntentProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intent: initialData.intent || "",
      exitTimeline: initialData.exitTimeline || "",
      idealOutcome: initialData.idealOutcome || "",
      valuationExpectations: initialData.valuationExpectations?.toString() || "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      onComplete({
        intent: values.intent,
        exitTimeline: values.exitTimeline,
        idealOutcome: values.idealOutcome || "",
        valuationExpectations: values.valuationExpectations,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save owner intent information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Owner Intent & Timeline</h2>
      <p className="text-sm text-gray-600 mb-6">Help us understand your future plans for the business.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="intent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are your primary intentions for the business?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your intention" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sell-full">Sell the entire business</SelectItem>
                    <SelectItem value="sell-partial">Sell a partial stake</SelectItem>
                    <SelectItem value="raise-capital">Raise capital/investment</SelectItem>
                    <SelectItem value="expansion">Expand operations</SelectItem>
                    <SelectItem value="succession">Family succession planning</SelectItem>
                    <SelectItem value="no-plans">No immediate plans</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exitTimeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeline for potential exit or capital raise:</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timeline" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0-6">0-6 months</SelectItem>
                    <SelectItem value="6-12">6-12 months</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                    <SelectItem value="no-plans">No plans to exit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idealOutcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your ideal outcome:</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="E.g., 'Sell to a strategic buyer who will grow the business', 'Find investors to expand globally', etc."
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valuationExpectations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are your valuation expectations?</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <Input
                      {...field}
                      type="number"
                      className="block w-full rounded-md border-gray-300 pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </FormControl>
                <p className="mt-1 text-xs text-gray-500">
                  Your honest expectation helps us provide better context in our valuation report.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Completing..." : "Complete & Get Valuation"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
