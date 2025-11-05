import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth.context";
import { DonorFormData } from "./auth.entity";

export const useRegister = () => {
  const navigate = useNavigate();

  const { 
    signUpNewUser, 
    signInWithGoogle 
  } = useAuth();

  const [formData, setFormData] = React.useState<DonorFormData>({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    blood_type: "",
    contact_number: "",
    email: "",
    address: "",
    city: "",
    province: "",
    zip_code: "",
    password: "",
    confirmPassword: "",
  });
  const [show, setShow] = React.useState<{ [key: string]: boolean}>({
    password: false,
    confirmPassword: false,
  });

  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleInputChange = (field: keyof DonorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.first_name.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.last_name.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.date_of_birth) {
      setError("Date of birth is required");
      return false;
    }

    // Check if donor is at least 16 years old
    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (age < 16 || (age === 16 && monthDiff < 0)) {
      setError("You must be at least 16 years old to register as a donor");
      return false;
    }

    if (!formData.blood_type) {
      setError("Blood type is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.contact_number.trim()) {
      setError("Contact number is required");
      return false;
    }

    // Basic phone number validation (Philippines format)
    const phoneRegex = /^(\+63|0)[0-9]{10}$/;
    if (!phoneRegex.test(formData.contact_number.replace(/[\s-]/g, ""))) {
      setError(
        "Please enter a valid Philippine phone number (e.g., +639123456789 or 09123456789)"
      );
      return false;
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.zip_code && formData.zip_code.trim()) {
      const zipRegex = /^[0-9]{4}$/;
      if (!zipRegex.test(formData.zip_code)) {
        setError("ZIP code must be 4 digits");
        return false;
      }
    }
    return true;
  };

  const validateStep4 = () => {
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/\d/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      setError("Password must contain at least one special character");
      return false;
    }
    return true;
  }

  const handleNext = () => {
    console.log(currentStep)
    setError("");

    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    console.log(currentStep)
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setError("");
    setIsLoading(true);

    // Simulate API call
    try {
      const result = await signUpNewUser(formData.email, formData.password); // Call context function

      if (result.success) {
        setSuccess(true); 
      } else {
        setError(result.error.message); // Show error message on failure
      }
    } catch (err) {
      setError("An unexpected error occurred."); // Catch unexpected errors
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return {
    // BEST PRACTICE: Always include methods used to return statements
    // ALL THE STATES AND HANDLERS
    formData,
    setFormData,
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
  };
};
