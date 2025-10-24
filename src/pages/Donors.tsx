import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Droplets, 
  UserPlus, 
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

const Donors = () => {
  const [showRegistration, setShowRegistration] = useState(false);

  const recentDonors = [
    { id: 1, name: "Maria Santos", bloodType: "O+", lastDonation: "2024-12-15", status: "Eligible", phone: "+63 912 345 6789" },
    { id: 2, name: "Juan dela Cruz", bloodType: "A+", lastDonation: "2024-11-20", status: "Eligible", phone: "+63 923 456 7890" },
    { id: 3, name: "Sofia Reyes", bloodType: "B-", lastDonation: "2025-01-10", status: "Temporarily Deferred", phone: "+63 934 567 8901" },
    { id: 4, name: "Carlos Garcia", bloodType: "AB+", lastDonation: "2024-10-05", status: "Eligible", phone: "+63 945 678 9012" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AlayDugo</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/inventory">Inventory</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/requests">Requests</Link>
            </Button>
            <Button variant="default">Sign In</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">Donor Management</h1>
            <p className="text-muted-foreground">Register and manage blood donors</p>
          </div>
          <Button 
            variant="default" 
            size="lg"
            onClick={() => setShowRegistration(!showRegistration)}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Register New Donor
          </Button>
        </div>

        {/* Registration Form */}
        {showRegistration && (
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle>New Donor Registration</CardTitle>
              <CardDescription>Complete the form below to register a new blood donor</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Juan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="dela Cruz" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <select 
                      id="bloodType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    <Input id="phone" type="tel" placeholder="+63 912 345 6789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="juan@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address</Label>
                  <Input id="address" placeholder="Street, Barangay" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Manila" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input id="province" placeholder="Metro Manila" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" placeholder="1000" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="default">Register Donor</Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowRegistration(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search donors by name, phone, or blood type..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Donors List */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Donors</CardTitle>
            <CardDescription>Recent donor registrations and their eligibility status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonors.map((donor) => (
                <div 
                  key={donor.id} 
                  className="p-5 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Droplets className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-foreground">{donor.name}</div>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="default">{donor.bloodType}</Badge>
                          <Badge 
                            variant={donor.status === "Eligible" ? "success" : "warning"}
                          >
                            {donor.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
                        <Phone className="h-3 w-3" />
                        {donor.phone}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
                        <Calendar className="h-3 w-3" />
                        Last donation: {donor.lastDonation}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donors;
