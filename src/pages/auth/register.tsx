import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Droplets, Heart, CheckCircle2, AlertCircle, User, Phone, Mail, MapPin, Calendar, Lock, EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegister } from "@/pages/auth/register.hook";
import { bloodTypes } from "./auth.entity";

const DonorRegister = () => {
  const { 
    // STATES AND HANDLER
    formData,
    handleInputChange,

    // SHOW PASSWORD
    show,
    setShow,

    // NAVIGATION HANDLERS
    currentStep,
    handleNext,
    handleBack,
    handleSubmit,

    // STATES
    isLoading,
    success,
    error,

    // METHODS
    navigate,
  } = useRegister();

    // ALL CODE BELOW IS IGNORED IF THIS SUCCEEDS
    if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Droplets className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                AlayDugo
              </span>
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center bg-secondary/30 py-12 px-4">
          <Card className="w-full max-w-md shadow-lg text-center">
            <CardContent className="pt-12 pb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Registration Successful!
              </h2>
              <p className="text-muted-foreground mb-6">
                Welcome to AlayDugo,{" "}
                <span className="font-semibold text-foreground">
                  {formData.first_name}
                </span>
                !<br/><br/><b>Kindly <u>check your email</u> to confirm account activation.</b>
              </p>
              <Button onClick={() => navigate("/donor-login")} size="lg">
                Go back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 md:mb-8">
      <div className="flex items-center space-x-2 sm:space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                currentStep >= step
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground text-muted-foreground"
              }`}
            >
              {currentStep > step ? (
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <span className="text-xs sm:text-sm font-semibold">{step}</span>
              )}
            </div>
            {step < 4 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${
                  currentStep > step ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">
            First Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="first_name"
              type="text"
              placeholder="Juan"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="last_name"
            type="text"
            placeholder="Dela Cruz"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth">
          Date of Birth <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
            className="pl-10"
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          You must be at least 16 years old to donate blood
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="blood_type">
          Blood Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.blood_type}
          onValueChange={(value) => handleInputChange("blood_type", value)}
        >
          <SelectTrigger id="blood_type">
            <SelectValue placeholder="Select your blood type" />
          </SelectTrigger>
          <SelectContent>
            {bloodTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact_number">
          Contact Number <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="contact_number"
            type="tel"
            placeholder="+639123456789 or 09123456789"
            value={formData.contact_number}
            onChange={(e) =>
              handleInputChange("contact_number", e.target.value)
            }
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          We'll use this to contact you for donation appointments
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address (Optional)</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="donor@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Receive updates and donation reminders via email
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Street Address (Optional)</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="address"
            placeholder="123 Rizal Street, Barangay Centro"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="pl-10 min-h-[80px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City/Municipality (Optional)</Label>
          <Input
            id="city"
            type="text"
            placeholder="Manila"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province (Optional)</Label>
          <Input
            id="province"
            type="text"
            placeholder="Metro Manila"
            value={formData.province}
            onChange={(e) => handleInputChange("province", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip_code">ZIP Code (Optional)</Label>
        <Input
          id="zip_code"
          type="text"
          placeholder="1000"
          value={formData.zip_code}
          onChange={(e) => handleInputChange("zip_code", e.target.value)}
          maxLength={4}
        />
        <p className="text-xs text-muted-foreground">4-digit postal code</p>
      </div>
    </div>
  );

  const renderStep4 = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="password">
        Password <span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="password"
          type={show.password ? "text" : "password"}
          placeholder="Enter a secure password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="pl-10 pr-10"
          required
          minLength={8}
        />
        <button
          type="button"
          onClick={() => setShow({ ...show, password: !show.password })}
          className="absolute right-2 top-2 p-1 text-muted-foreground"
          aria-label={show.password ? "Hide password" : "Show password"}
        >
          {show.password ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
    </div>

    <div className="space-y-2">
      <Label htmlFor="password_confirmation">
        Confirm Password <span className="text-destructive">*</span>
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="password_confirmation"
          type={show.confirmPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) =>
            handleInputChange("confirmPassword", e.target.value)
          }
          className="pl-10 pr-10"
          required
          minLength={8}
        />
      </div>
    </div>

    <Alert className="bg-primary/5 border-primary/20">
      <Heart className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm">
        By registering, you're joining thousands of heroes saving lives
        through blood donation. Thank you for your commitment to help others!
      </AlertDescription>
    </Alert>
  </div>
);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Content */}
      <div className="flex-1 bg-secondary/30 py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Become a Lifesaving Hero
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Register as a blood donor and help save lives in the Philippines
              </p>
            </div>
            <div className="w-full">
              {/* Registration Card */}
              <Card className="shadow-lg">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-xl md:text-2xl">
                    {currentStep === 1 && "Personal Information"}
                    {currentStep === 2 && "Contact Information"}
                    {currentStep === 3 && "Address Details"}
                    {currentStep === 4 && "Set Your Password"}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {currentStep === 1 && "Let's start with your basic information"}
                    {currentStep === 2 && "How can we reach you?"}
                    {currentStep === 3 && "Where are you located?"}
                    {currentStep === 4 && "Create a secure password for your account"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderStepIndicator()}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )} 

                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}

                    <div className="flex gap-3 md:gap-4 pt-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1"
                          size="default"
                        >
                          Back
                        </Button>
                      )}

                      {currentStep < 4 ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="flex-1"
                          size="default"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isLoading}
                          size="default"
                        >
                          <span className="hidden sm:inline">{isLoading ? "Registering..." : "Complete Registration"}</span>
                          <span className="sm:hidden">{isLoading ? "Register..." : "Register"}</span>
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/donor-login"
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 AlayDugo - Philippine Red Cross. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DonorRegister;
