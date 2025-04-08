import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingFormData } from "@shared/schema";
import { 
  gicsSectors, 
  gicsIndustryGroups, 
  getSectorById, 
  getIndustryGroupsBySectorId,
  generateUniqueCompanyId 
} from "@shared/gicsSectors";

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  sector: z.string().min(1, "Please select a sector"),
  industryGroup: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  yearsInBusiness: z.string().min(1, "Please select years in business"),
  goal: z.string().min(1, "Please select your primary goal"),
});

type OnboardingFormProps = {
  onComplete: (data: OnboardingFormData) => void;
};

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [_, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [industryGroups, setIndustryGroups] = useState<typeof gicsIndustryGroups>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      website: "",
      sector: "",
      industryGroup: "",
      location: "",
      yearsInBusiness: "",
      goal: "",
    },
  });

  // Update industry groups when sector changes
  useEffect(() => {
    if (selectedSector) {
      const groups = getIndustryGroupsBySectorId(selectedSector);
      setIndustryGroups(groups);
      
      // Reset industry group when sector changes
      form.setValue("industryGroup", "");
    }
  }, [selectedSector, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the company
      const uniqueId = generateUniqueCompanyId(values.companyName, values.website || "");
      
      // Get sector and industry group names
      const sectorInfo = getSectorById(values.sector);
      
      // Prepare form data with sector names instead of IDs for better readability
      const formData: OnboardingFormData = {
        ...values,
        // If sector name is available, use it, otherwise use the ID
        sector: sectorInfo ? sectorInfo.name : values.sector,
        // If industry group is not selected, use an empty string
        industryGroup: values.industryGroup || "",
        // Make website null if undefined
        website: values.website || null,
      };
      
      // Save the onboarding data
      onComplete(formData);
      
      // Navigate to the business data wizard
      setLocation("/business-data");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Let's get started</h1>
          <p className="mt-2 text-gray-600">First, we need some basic information about you and your business.</p>
        </div>

        <Card className="shadow-sm border border-gray-100">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company website</FormLabel>
                      <FormControl>
                        <Input placeholder="www.example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Our AI can analyze your website to extract valuable information
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSector(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gicsSectors.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="industryGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry group</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!selectedSector || industryGroups.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industryGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {selectedSector && industryGroups.length === 0 
                          ? "No specific industry groups available for this sector" 
                          : "Select a more specific industry group"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Amsterdam, Netherlands" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsInBusiness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years in business</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's your primary goal?</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sell">Sell my business</SelectItem>
                          <SelectItem value="raise">Raise funds/investment</SelectItem>
                          <SelectItem value="merger">Consider merger opportunities</SelectItem>
                          <SelectItem value="acquisition">Explore acquisition targets</SelectItem>
                          <SelectItem value="planning">Strategic planning</SelectItem>
                          <SelectItem value="curious">Just curious about my valuation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Continue to Business Data"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
