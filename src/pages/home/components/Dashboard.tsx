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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBloodInventory } from "@/hooks/use-blood-inventory";
import { useBloodRequests } from "@/hooks/use-blood-requests";

const Dashboard = () => {
  // Get total units from shared inventory hook
  const { totalUnits } = useBloodInventory();
  
  // Get emergency requests from shared blood requests hook
  const { emergencyRequests, urgentRequests } = useBloodRequests();

  // Fetch active donors count
  const { data: activeDonorsCount = 0 } = useQuery({
    queryKey: ["active-donors-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("eligibility_status", "Eligible");
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch blood inventory from database
  const { data: inventoryStatus = [] } = useQuery({
    queryKey: ["blood-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_units")
        .select("blood_type")
        .eq("status", "In-Storage");
      
      if (error) throw error;

      // Count units by blood type
      const counts = data.reduce((acc, unit) => {
        acc[unit.blood_type] = (acc[unit.blood_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Define all blood types
      const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

      // Map to inventory status with thresholds
      return bloodTypes.map(bloodType => {
        const units = counts[bloodType] || 0;
        let status: "good" | "medium" | "low" | "critical";
        
        if (units >= 200) status = "good";
        else if (units >= 100) status = "medium";
        else if (units >= 75) status = "low";
        else status = "critical";

        return { bloodType, units, status };
      });
    },
  });

  const upcomingDrives = [
    { id: 1, name: "Makati Blood Drive", location: "Makati City Hall", date: "Jan 28, 2025" },
    { id: 2, name: "University of Manila Drive", location: "UM Campus", date: "Jan 30, 2025" },
    { id: 3, name: "BGC Community Drive", location: "BGC Central Park", date: "Feb 2, 2025" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}


      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-muted-foreground text-center">Overview of blood bank operations across PRC network</p>
        </div>


        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Active Donors</div>
                  <div className="text-3xl font-bold text-foreground">{activeDonorsCount.toLocaleString()}</div>
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
                  <div className="text-sm text-muted-foreground mb-1">Units in Stock</div>
                  <div className="text-3xl font-bold text-foreground">{totalUnits.toLocaleString()}</div>
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
                  <div className="text-3xl font-bold text-foreground">{emergencyRequests.length}</div>
                  <div className="text-xs text-emergency flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {urgentRequests.length} urgent
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

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Donation Drives</CardTitle>
                <CardDescription>Scheduled blood donation events across the network</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/schedule-drive">Schedule New Drive</Link>
              </Button>
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

        <div className="grid lg:grid-cols-2 gap-6 my-8">
          {/* Emergency Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Emergency Requests</CardTitle>
                  <CardDescription>Urgent blood requests requiring immediate attention</CardDescription>
                </div>
                <Button variant="emergency" size="sm">
                  <Link to='/requests'>
                  View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyRequests.length > 0 ? (
                  emergencyRequests.slice(0, 3).map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emergency/10 rounded">
                          <Droplets className="h-5 w-5 text-emergency" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{request.hospital}</div>
                          <div className="text-sm text-muted-foreground flex items-wrap gap-2">
                            {request.items.slice(0, 2).map((item: any, idx: number) => (
                              <Badge key={idx} variant="emergency">{item.bloodType}</Badge>
                            ))}
                            <span>{request.items.reduce((sum: number, item: any) => sum + (item.requested - (item.fulfilled || 0)), 0)} units needed</span>
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
        
      </div>
    </div>
  );
};

export default Dashboard;
