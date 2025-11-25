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
import {
  Droplets,
  Package,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecordNewUnit } from "./Inventory/components/RecordNewUnit";

interface InventoryItem {
  bloodType: string;
  total: number;
  available: number;
  inTesting: number;
  expiringSoon: number;
  trend: "up" | "down" | "stable";
}

const Inventory = () => {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  
  // Fetch blood units data from database
  const { data: bloodUnits = [] } = useQuery({
    queryKey: ["blood-units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_units")
        .select("blood_type, status, expiry_date");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch urgent blood requests for low stock alerts
  const { data: lowStockAlerts = [] } = useQuery({
    queryKey: ["low-stock-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_requests")
        .select(`
          request_id,
          urgency,
          status,
          hospitals (hospital_name),
          blood_request_items (
            blood_type,
            quantity_requested,
            quantity_fulfilled
          )
        `)
        .in("urgency", ["Urgent", "Emergency"])
        .in("status", ["Pending", "Partially Fulfilled"])
        .order("request_datetime", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Transform data for display
      return (data || []).flatMap((request: any) => 
        (request.blood_request_items || []).map((item: any) => ({
          hospital: request.hospitals?.hospital_name || "Unknown Hospital",
          bloodType: item.blood_type,
          unitsNeeded: item.quantity_requested - (item.quantity_fulfilled || 0),
          status: request.urgency === "Emergency" ? "critical" : "low",
          urgency: request.urgency
        }))
      ).filter((alert: any) => alert.unitsNeeded > 0).slice(0, 5);
    },
  });

  // Calculate inventory data from database
  const inventoryData: InventoryItem[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bloodType) => {
    const unitsOfType = bloodUnits.filter((unit) => unit.blood_type === bloodType);
    const total = unitsOfType.length;
    const available = unitsOfType.filter((unit) => unit.status === "In-Storage").length;
    const inTesting = unitsOfType.filter((unit) => unit.status === "In-Testing").length;
    
    // Calculate expiring soon (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringSoon = unitsOfType.filter((unit) => {
      const expiryDate = new Date(unit.expiry_date);
      return expiryDate <= sevenDaysFromNow && expiryDate >= new Date();
    }).length;

    return {
      bloodType,
      total,
      available,
      inTesting,
      expiringSoon,
      trend: "stable" as const,
    };
  });


  const recentTransfers = [
    {
      id: 1,
      from: "Manila Center",
      to: "Quezon City Center",
      bloodType: "A+",
      units: 15,
      date: "2025-01-23",
    },
    {
      id: 2,
      from: "Cebu Center",
      to: "Mandaue Center",
      bloodType: "O+",
      units: 20,
      date: "2025-01-23",
    },
    {
      id: 3,
      from: "Davao Center",
      to: "General Santos Center",
      bloodType: "B+",
      units: 10,
      date: "2025-01-22",
    },
  ];

  const getStatusBadge = (total: number) => {
    if (total < 100) return <Badge variant="emergency">Critical</Badge>;
    if (total < 150) return <Badge variant="warning">Low</Badge>;
    return <Badge variant="success">Good</Badge>;
  };

  // Calculate summary statistics
  const totalUnits = inventoryData.reduce((sum, item) => sum + item.total, 0);
  const availableUnits = inventoryData.reduce((sum, item) => sum + item.available, 0);
  const inTestingUnits = inventoryData.reduce((sum, item) => sum + item.inTesting, 0);
  const expiringSoonUnits = inventoryData.reduce((sum, item) => sum + item.expiringSoon, 0);

  const exportToCSV = () => {
    const timestamp = new Date().toISOString().split("T")[0];

    let csvContent = "AlayDugo Blood Inventory Report\n";
    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Summary section
    csvContent += "INVENTORY SUMMARY\n";
    csvContent += `Total Units,${totalUnits}\n`;
    csvContent += `Available Units,${availableUnits}\n`;
    csvContent += `In Testing,${inTestingUnits}\n`;
    csvContent += `Expiring Soon (7 days),${expiringSoonUnits}\n\n`;

    // Blood type inventory
    csvContent += "INVENTORY BY BLOOD TYPE\n";
    csvContent += "Blood Type,Total,Available,In Testing,Expiring Soon,Trend\n";
    inventoryData.forEach((item) => {
      csvContent += `${item.bloodType},${item.total},${item.available},${item.inTesting},${item.expiringSoon},${item.trend}\n`;
    });

    // Low stock alerts
    csvContent += "\nLOW STOCK ALERTS (URGENT REQUESTS)\n";
    csvContent += "Hospital,Blood Type,Units Needed,Status\n";
    lowStockAlerts.forEach((item: any) => {
      csvContent += `${item.hospital},${item.bloodType},${item.unitsNeeded},${item.status}\n`;
    });

    // Recent transfers
    csvContent += "\nRECENT TRANSFERS\n";
    csvContent += "From Center,To Center,Blood Type,Units,Date\n";
    recentTransfers.forEach((item) => {
      csvContent += `${item.from},${item.to},${item.bloodType},${item.units},${item.date}\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `blood-inventory-report-${timestamp}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Blood Inventory
            </h1>
            <p className="text-muted-foreground">
              Real-time blood unit tracking across PRC network
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportToCSV}>
              <Package className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="default" onClick={() => setIsRecordDialogOpen(true)}>
              Record New Unit
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">
                Total Units
              </div>
              <div className="text-3xl font-bold text-foreground">
                {totalUnits.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Across all blood types
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">
                Available
              </div>
              <div className="text-3xl font-bold text-foreground">
                {availableUnits.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalUnits > 0 ? Math.round((availableUnits / totalUnits) * 100) : 0}% of total inventory
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">
                In Testing
              </div>
              <div className="text-3xl font-bold text-foreground">
                {inTestingUnits.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Awaiting clearance
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">
                Expiring Soon
              </div>
              <div className="text-3xl font-bold text-warning">
                {expiringSoonUnits.toLocaleString()}
              </div>
              <div className="text-xs text-warning flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Within 7 days
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 my-8">
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>
                Urgent blood requests requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockAlerts.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No urgent blood requests at this time
                  </div>
                ) : (
                  lowStockAlerts.map((item: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">
                            {item.hospital}
                          </span>
                        </div>
                        <Badge
                          variant={
                            item.status === "critical" ? "emergency" : "warning"
                          }
                        >
                          {item.urgency}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Blood Type:{" "}
                          <span className="font-semibold text-foreground">
                            {item.bloodType}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-foreground">
                            {item.unitsNeeded}
                          </span>{" "}
                          units needed
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transfers</CardTitle>
              <CardDescription>
                Blood unit movements between PRC centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransfers.map((transfer) => (
                  <div key={transfer.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="default">{transfer.bloodType}</Badge>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {transfer.date}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {transfer.from}
                        </span>
                        <span>→</span>
                        <span className="font-semibold text-foreground">
                          {transfer.to}
                        </span>
                      </div>
                      <div className="text-foreground font-semibold">
                        {transfer.units} units transferred
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory by Blood Type */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Inventory by Blood Type</CardTitle>
            <CardDescription>
              Current stock levels and distribution across all units
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryData.map((item) => (
                <div
                  key={item.bloodType}
                  className="p-5 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Droplets className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {item.bloodType}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Blood Type
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-foreground">
                          {item.total}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          total units
                        </div>
                      </div>
                      {getStatusBadge(item.total)}
                      {item.trend === "up" && (
                        <TrendingUp className="h-5 w-5 text-success" />
                      )}
                      {item.trend === "down" && (
                        <TrendingDown className="h-5 w-5 text-emergency" />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Available
                      </div>
                      <div className="text-lg font-semibold text-success">
                        {item.available}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        In Testing
                      </div>
                      <div className="text-lg font-semibold text-muted-foreground">
                        {item.inTesting}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Expiring Soon
                      </div>
                      <div className="text-lg font-semibold text-warning">
                        {item.expiringSoon}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />

      {/* Record New Unit Dialog */}
      <RecordNewUnit 
        open={isRecordDialogOpen} 
        onOpenChange={setIsRecordDialogOpen} 
      />
    </div>
  );
};

export default Inventory;
