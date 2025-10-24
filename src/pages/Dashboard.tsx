import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  AlertCircle, 
  Users, 
  Package, 
  TrendingUp,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const emergencyRequests = [
    { id: 1, hospital: "Manila General Hospital", bloodType: "O-", units: 5, time: "15 mins ago" },
    { id: 2, hospital: "Cebu Medical Center", bloodType: "AB+", units: 3, time: "32 mins ago" },
    { id: 3, hospital: "Davao Regional Hospital", bloodType: "A+", units: 4, time: "1 hour ago" },
  ];

  const inventoryStatus = [
    { bloodType: "O+", units: 342, status: "good" },
    { bloodType: "O-", units: 87, status: "low" },
    { bloodType: "A+", units: 256, status: "good" },
    { bloodType: "A-", units: 134, status: "medium" },
    { bloodType: "B+", units: 198, status: "good" },
    { bloodType: "B-", units: 76, status: "low" },
    { bloodType: "AB+", units: 145, status: "medium" },
    { bloodType: "AB-", units: 52, status: "critical" },
  ];

  const upcomingDrives = [
    { id: 1, name: "Makati Blood Drive", location: "Makati City Hall", date: "Jan 28, 2025" },
    { id: 2, name: "University of Manila Drive", location: "UM Campus", date: "Jan 30, 2025" },
    { id: 3, name: "BGC Community Drive", location: "BGC Central Park", date: "Feb 2, 2025" },
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
              <Link to="/donors">Donors</Link>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of blood bank operations across PRC network</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Active Donors</div>
                  <div className="text-3xl font-bold text-foreground">15,420</div>
                  <div className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% from last month
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
                  <div className="text-sm text-muted-foreground mb-1">Units in Stock</div>
                  <div className="text-3xl font-bold text-foreground">2,847</div>
                  <div className="text-xs text-warning flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    3 types below threshold
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
                  <div className="text-sm text-muted-foreground mb-1">Emergency Requests</div>
                  <div className="text-3xl font-bold text-foreground">23</div>
                  <div className="text-xs text-emergency flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    3 urgent
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
                  <div className="text-sm text-muted-foreground mb-1">Fulfillment Rate</div>
                  <div className="text-3xl font-bold text-foreground">98.2%</div>
                  <div className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    Above target
                  </div>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Emergency Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Emergency Requests</CardTitle>
                  <CardDescription>Urgent blood requests requiring immediate attention</CardDescription>
                </div>
                <Button variant="emergency" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emergency/10 rounded">
                        <Droplets className="h-5 w-5 text-emergency" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{request.hospital}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="emergency">{request.bloodType}</Badge>
                          <span>{request.units} units needed</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {request.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Blood Inventory</CardTitle>
                  <CardDescription>Current stock levels by blood type</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/inventory">Manage</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {inventoryStatus.map((item) => (
                  <div key={item.bloodType} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-foreground">{item.bloodType}</span>
                      <Badge 
                        variant={
                          item.status === "good" ? "success" : 
                          item.status === "critical" ? "emergency" : 
                          "warning"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{item.units}</div>
                    <div className="text-xs text-muted-foreground">units available</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Donation Drives */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Donation Drives</CardTitle>
                <CardDescription>Scheduled blood donation events across the network</CardDescription>
              </div>
              <Button variant="outline" size="sm">Schedule New Drive</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingDrives.map((drive) => (
                <div key={drive.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">{drive.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3" />
                        {drive.location}
                      </div>
                      <Badge variant="outline">{drive.date}</Badge>
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

export default Dashboard;
