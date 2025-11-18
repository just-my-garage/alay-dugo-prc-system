import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Droplets,
  UserPlus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import useDonorPage from "./donor.hook";
import NewDonorComponent from "./components/new-donor";

const Donors = () => {
  const { fetch, isLoading, setIsLoading, handleDelete } = useDonorPage();
  const [showRegistration, setShowRegistration] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Donor Management
            </h1>
            <p className="text-muted-foreground">
              Register and manage blood donors
            </p>
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
          <NewDonorComponent setShowRegistration={setShowRegistration} />
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
            <CardDescription>
              Recent donor registrations and their eligibility status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fetch.data?.map((donor: any) => (
                <div
                  key={donor.donor_id}
                  className="p-5 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Droplets className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-foreground">
                          {donor.first_name} {donor.last_name}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="default">{donor.blood_type}</Badge>
                          <Badge variant={"success"}>
                            {/* {donor.status} */}success
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right space-y-2">
                        <div className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
                          <Phone className="h-3 w-3" />
                          {donor.contact_number}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 justify-end">
                          <Calendar className="h-3 w-3" />
                          {/* Last donation: {donor.lastDonation} */}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(donor.donor_id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
