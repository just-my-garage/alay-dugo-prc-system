import { useRegister } from "../../auth/register.hook";

import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewDonorComponent = ({ setShowRegistration }) => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    success,
  } = useRegister();

  return (
    <Card className="mb-8 border-primary/20">
      <CardHeader>
        <CardTitle>New Donor Registration</CardTitle>
        <CardDescription>
          Complete the form below to register a new blood donor
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="bg-success/10 text-success text-md p-4 rounded-md mb-4 ">
            <b>User Successfully Registered!</b> <br/>
            Kindly inform the donor to check their email for account activation instructions.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Juan"
                value={formData.first_name}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="dela Cruz"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) =>
                  handleInputChange("date_of_birth", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <select
                id="bloodType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.blood_type}
                onChange={(e) =>
                  handleInputChange("blood_type", e.target.value)
                }
                disabled={isLoading}
              >
                <option value="">Select blood type</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+63 912 345 6789"
                value={formData.contact_number}
                onChange={(e) =>
                  handleInputChange("contact_number", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Complete Address</Label>
            <Input
              id="address"
              placeholder="Street, Barangay"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Manila"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                placeholder="Metro Manila"
                value={formData.province}
                onChange={(e) => handleInputChange("province", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="1000"
                value={formData.zip_code}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Add your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register Donor"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRegistration(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewDonorComponent;
