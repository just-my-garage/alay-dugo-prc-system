export interface DonorFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  blood_type: string;
  contact_number: string;
  email: string;
  address: string;
  city: string;
  province: string;
  zip_code: string;
}

export const bloodTypes: Array<string> = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];