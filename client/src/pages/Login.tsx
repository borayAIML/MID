import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Define the form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [location, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (response && response.success) {
        toast({
          title: "Login successful",
          description: "Welcome back! Redirecting you to the dashboard.",
          variant: "destructive", // Using destructive as a workaround for success
        });
        
        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(response.user));
        localStorage.setItem("companyId", response.companyId ? response.companyId.toString() : "");
        
        // Navigate to valuation dashboard
        setTimeout(() => {
          navigate("/valuation");
        }, 1000);
      } else {
        toast({
          title: "Login failed",
          description: response && response.message ? response.message : "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-lg border-indigo-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
            Sign In to MANDA INSTITUTE
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          placeholder="you@example.com" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-10" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-right">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="mr-2">Signing in</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2">Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="space-x-2">
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.4253 0 3.42535 2.64 1.33533 6.45001L5.27531 9.5C6.21532 6.76001 8.87033 4.75 12.0003 4.75Z" fill="#EA4335" />
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                <path d="M5.26498 14.5C5.02498 13.71 4.89001 12.87 4.89001 12C4.89001 11.14 5.01998 10.31 5.26498 9.5L1.325 6.44995C0.484983 8.18995 0 10.04 0 12C0 13.98 0.494964 15.85 1.32996 17.6L5.26498 14.5Z" fill="#FBBC05" />
                <path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.25 12.0004 19.25C8.87045 19.25 6.22043 17.24 5.27045 14.5L1.33044 17.6C3.42046 21.42 7.42045 24 12.0004 24Z" fill="#34A853" />
              </svg>
              <span>Google</span>
            </Button>
            
            <Button variant="outline" className="space-x-2">
              <svg className="h-5 w-5 text-[#0A66C2]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </Button>
            
            <Button variant="outline" className="space-x-2">
              <svg className="h-5 w-5 text-[#00A4EF]" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.4008 24H0V12.4C0 5.55051 5.55051 0 12.4 0H24V11.4008C24 18.2497 18.4497 24 11.4008 24Z" fill="#F25022" />
                <path d="M24 24H12.5992V12.5992C12.5992 5.75029 18.1503 0 25 0H36.4008V11.4008C36.4008 18.2497 30.8497 24 24 24Z" fill="#7FBA00" />
                <path d="M11.4008 36.4008H0V25C0 18.1503 5.55051 12.5992 12.4 12.5992H24V24C24 30.8497 18.4497 36.4008 11.4008 36.4008Z" fill="#00A4EF" />
                <path d="M24 36.4008H12.5992V25C12.5992 18.1503 18.1503 12.5992 25 12.5992H36.4008V24C36.4008 30.8497 30.8497 36.4008 24 36.4008Z" fill="#FFB900" />
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a onClick={() => navigate("/signup")} className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium">
              Create one now
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}