
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { EyeIcon, EyeOffIcon, CheckCircle2, AlertCircle } from "lucide-react";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("signup") === "true";
  const [activeTab, setActiveTab] = useState(isSignUp ? "signup" : "signin");
  const [signupRole, setSignupRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institution: "",
    specialty: "",
    adminCode: "",
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationState, setValidationState] = useState({
    email: true,
    password: true
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(isSignUp ? "signup" : "signin");
  }, [isSignUp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Simple validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidationState((prev) => ({
        ...prev,
        email: emailRegex.test(value) || value === ""
      }));
    }
    
    if (name === "password") {
      setValidationState((prev) => ({
        ...prev,
        password: value.length >= 6 || value === ""
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "signup" && !formData.acceptTerms) {
      toast({
        title: "Terms and Conditions",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // This would normally be authenticated with a real backend
      if (activeTab === "signin") {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
          variant: "default",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Account created!",
          description: `Your ${signupRole} account has been successfully created.`,
          variant: "default",
        });
        navigate("/dashboard");
      }
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-scale-in">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your account to continue learning
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={!validationState.email ? "border-red-500 pr-10" : ""}
                    required
                  />
                  {!validationState.email && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
                {!validationState.email && (
                  <p className="text-red-500 text-sm">Please enter a valid email address</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={!validationState.password ? "border-red-500 pr-10" : ""}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  {!validationState.password && (
                    <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
                {!validationState.password && (
                  <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Join thousands of students on our platform
            </CardDescription>
          </CardHeader>
          
          <Tabs value={signupRole} onValueChange={setSignupRole} className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="trainer">Trainer</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution/School</Label>
                    <Input
                      id="institution"
                      name="institution"
                      placeholder="University of Example"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <div className="relative">
                      <Input
                        id="student-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={!validationState.email ? "border-red-500 pr-10" : ""}
                        required
                      />
                      {formData.email && validationState.email && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                      {!validationState.email && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!validationState.email && (
                      <p className="text-red-500 text-sm">Please enter a valid email address</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={!validationState.password ? "border-red-500 pr-10" : ""}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {!validationState.password && (
                        <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!validationState.password && (
                      <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.acceptTerms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I accept the terms and conditions
                    </label>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Student Account"}
                  </Button>
                  
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="trainer">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainer-name">Full Name</Label>
                    <Input
                      id="trainer-name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty/Subject</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      placeholder="Mathematics, Science, etc."
                      value={formData.specialty}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainer-email">Email</Label>
                    <div className="relative">
                      <Input
                        id="trainer-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={!validationState.email ? "border-red-500 pr-10" : ""}
                        required
                      />
                      {formData.email && validationState.email && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                      {!validationState.email && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!validationState.email && (
                      <p className="text-red-500 text-sm">Please enter a valid email address</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainer-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="trainer-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={!validationState.password ? "border-red-500 pr-10" : ""}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {!validationState.password && (
                        <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!validationState.password && (
                      <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="trainer-terms" 
                      checked={formData.acceptTerms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="trainer-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I accept the terms and conditions
                    </label>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Trainer Account"}
                  </Button>
                  
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Full Name</Label>
                    <Input
                      id="admin-name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-code">Admin Authorization Code</Label>
                    <Input
                      id="admin-code"
                      name="adminCode"
                      placeholder="Enter your authorization code"
                      value={formData.adminCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <div className="relative">
                      <Input
                        id="admin-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={!validationState.email ? "border-red-500 pr-10" : ""}
                        required
                      />
                      {formData.email && validationState.email && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                      {!validationState.email && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!validationState.email && (
                      <p className="text-red-500 text-sm">Please enter a valid email address</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={!validationState.password ? "border-red-500 pr-10" : ""}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {!validationState.password && (
                        <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!validationState.password && (
                      <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin-terms" 
                      checked={formData.acceptTerms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="admin-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I accept the terms and conditions
                    </label>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Admin Account"}
                  </Button>
                  
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
