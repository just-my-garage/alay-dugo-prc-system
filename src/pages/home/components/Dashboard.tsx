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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Droplets,
  AlertCircle,
  Users,
  Package,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Search,
  CalendarPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardProps {
  activeDonorsCount: number;
  totalUnits: number;
  emergencyRequests: any[];
  inventoryStatus: {
    bloodType: string;
    units: number;
    status: "good" | "medium" | "low" | "critical";
  }[];
  donationDrives: any;
  fulfillmentRate: number;
  session: any;
  userProfile: any;
}

const Dashboard = ({
  activeDonorsCount,
  totalUnits,
  emergencyRequests,
  inventoryStatus,
  donationDrives,
  fulfillmentRate,
  session,
  userProfile,
}: DashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Ongoing");

  // Filter donation drives based on search query and status
  const filteredDrives = donationDrives?.filter((drive: any) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      drive.drive_name?.toLowerCase().includes(query) ||
      drive.venue_address?.toLowerCase().includes(query) ||
      drive.city?.toLowerCase().includes(query) ||
      drive.province?.toLowerCase().includes(query);

    // If searching, return all matching drives regardless of status filter
    if (searchQuery.trim()) {
      return matchesSearch;
    }

    // Otherwise, apply status filter
    // Determine drive status
    const startDate = new Date(drive.start_datetime);
    const endDate = new Date(drive.end_datetime);
    const now = new Date();
    
    const isUpcoming = startDate > now;
    const isOngoing = startDate <= now && endDate >= now;
    const isPast = endDate < now;
    
    let driveStatus = "";
    if (drive.status === "Completed") driveStatus = "Completed";
    else if (drive.status === "Cancelled") driveStatus = "Cancelled";
    else if (isOngoing) driveStatus = "Ongoing";
    else if (isUpcoming) driveStatus = "Upcoming";
    else if (isPast) driveStatus = "Past";

    const matchesStatus = statusFilter === "All" || driveStatus === statusFilter;

    return matchesStatus;
  }) || [];

  return (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-muted-foreground text-center">
          Overview of blood bank operations across PRC network
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Active Donors
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {activeDonorsCount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Eligible to donate
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Units in Stock
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {totalUnits.toLocaleString()}
                </div>
                <div className="text-xs text-warning flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />3 types below threshold
                </div>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Package className="h-8 w-8 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Emergency Requests
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {emergencyRequests.length}
                </div>
                <div className="text-xs text-emergency flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  Need blood urgently
                </div>
              </div>
              <div className="p-3 bg-emergency/10 rounded-lg">
                <AlertCircle className="h-8 w-8 text-emergency" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Fulfillment Rate
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {fulfillmentRate.toFixed(1)}%
                </div>
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  fulfillmentRate >= 90 ? 'text-success' : 
                  fulfillmentRate >= 70 ? 'text-warning' : 
                  'text-emergency'
                }`}>
                  <TrendingUp className="h-3 w-3" />
                  {fulfillmentRate >= 90 ? 'Above target' : 
                   fulfillmentRate >= 70 ? 'Near target' : 
                   'Below target'}
                </div>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule My Donation CTA - Only show for non-admin logged-in users */}
      {session && !userProfile?.is_admin && (
        <Card className="mb-8 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary rounded-full">
                  <CalendarPlus className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Ready to Save Lives?
                  </h3>
                  <p className="text-muted-foreground">
                    Browse donation drives below and click on one to schedule your appointment
                  </p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="whitespace-nowrap"
                onClick={() => {
                  document.getElementById('donation-drives-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <CalendarPlus className="h-5 w-5 mr-2" />
                View Donation Drives
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card id="donation-drives-section">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Donation Drives</CardTitle>
              <CardDescription>
                Scheduled blood donation events across the network
              </CardDescription>
            </div>
            {session && userProfile?.is_admin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/schedule-drive">Schedule New Drive</Link>
              </Button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search drives by name, location, city, or province..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mt-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="Ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="Past">Past</TabsTrigger>
              <TabsTrigger value="Completed">Completed</TabsTrigger>
              <TabsTrigger value="All">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredDrives.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {filteredDrives.map((drive: any) => {
              const startDate = new Date(drive.start_datetime);
              const endDate = new Date(drive.end_datetime);
              const now = new Date();
              
              const isUpcoming = startDate > now;
              const isOngoing = startDate <= now && endDate >= now;
              const isPast = endDate < now;
              
              const getStatusBadge = () => {
                if (drive.status === "Completed") return <Badge variant="default">Completed</Badge>;
                if (drive.status === "Cancelled") return <Badge variant="destructive">Cancelled</Badge>;
                if (isOngoing) return <Badge variant="success">Ongoing</Badge>;
                if (isUpcoming) return <Badge variant="outline">Upcoming</Badge>;
                if (isPast) return <Badge variant="secondary">Past</Badge>;
                return <Badge variant="outline">{drive.status}</Badge>;
              };

              return (
                <Link
                  key={drive.drive_id}
                  to={`/drive/${drive.drive_id}`}
                  className="block"
                >
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-primary">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="font-semibold text-foreground">
                            {drive.drive_name}
                          </div>
                          {getStatusBadge()}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3" />
                          {drive.venue_address}
                        </div>
                        <Badge variant="outline">
                          {new Date(drive.start_datetime).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-1">
                {searchQuery ? "No drives found" : "No donation drives scheduled"}
              </p>
              <p className="text-sm">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Check back later for upcoming donation drives"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 my-8">
        {/* Emergency Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Emergency Requests</CardTitle>
                <CardDescription>
                  Urgent blood requests requiring immediate attention
                </CardDescription>
              </div>
              {session && (
                <Button variant="emergency" size="sm">
                  <Link to="/requests">View All</Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyRequests.length > 0 ? (
                emergencyRequests.slice(0, 3).map((request: any) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emergency/10 rounded">
                        <Droplets className="h-5 w-5 text-emergency" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {request.hospital}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-wrap gap-2">
                          {request.items
                            .slice(0, 2)
                            .map((item: any, idx: number) => (
                              <Badge key={idx} variant="emergency">
                                {item.bloodType}
                              </Badge>
                            ))}
                          <span>
                            {request.items.reduce(
                              (sum: number, item: any) =>
                                sum + (item.requested - (item.fulfilled || 0)),
                              0
                            )}{" "}
                            units needed
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {request.requestDate}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No emergency requests at this time</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Blood Inventory</CardTitle>
                <CardDescription>
                  Current stock levels by blood type
                </CardDescription>
              </div>
              {session && userProfile?.is_admin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/inventory">Manage</Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {inventoryStatus.map((item) => (
                <div key={item.bloodType} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-foreground">
                      {item.bloodType}
                    </span>
                    <Badge
                      variant={
                        item.status === "good"
                          ? "success"
                          : item.status === "critical"
                          ? "emergency"
                          : "warning"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {item.units}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    units available
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Donation Drives */}
    </div>
  </div>
  );
};

export default Dashboard;