import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  Package, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

const Inventory = () => {
  const inventoryData = [
    { bloodType: "O+", total: 342, available: 312, inTesting: 20, expiringSoon: 10, trend: "up" },
    { bloodType: "O-", total: 87, available: 75, inTesting: 8, expiringSoon: 4, trend: "down" },
    { bloodType: "A+", total: 256, available: 234, inTesting: 15, expiringSoon: 7, trend: "up" },
    { bloodType: "A-", total: 134, available: 120, inTesting: 10, expiringSoon: 4, trend: "stable" },
    { bloodType: "B+", total: 198, available: 180, inTesting: 12, expiringSoon: 6, trend: "up" },
    { bloodType: "B-", total: 76, available: 68, inTesting: 5, expiringSoon: 3, trend: "down" },
    { bloodType: "AB+", total: 145, available: 132, inTesting: 8, expiringSoon: 5, trend: "stable" },
    { bloodType: "AB-", total: 52, available: 45, inTesting: 4, expiringSoon: 3, trend: "down" },
  ];

  const centerInventory = [
    { center: "Manila PRC Center", bloodType: "O-", units: 32, status: "low" },
    { center: "Cebu PRC Center", bloodType: "AB-", units: 18, status: "critical" },
    { center: "Davao PRC Center", bloodType: "B-", units: 25, status: "low" },
  ];

  const recentTransfers = [
    { id: 1, from: "Manila Center", to: "Quezon City Center", bloodType: "A+", units: 15, date: "2025-01-23" },
    { id: 2, from: "Cebu Center", to: "Mandaue Center", bloodType: "O+", units: 20, date: "2025-01-23" },
    { id: 3, from: "Davao Center", to: "General Santos Center", bloodType: "B+", units: 10, date: "2025-01-22" },
  ];

  const getStatusBadge = (total: number) => {
    if (total < 100) return <Badge variant="emergency">Critical</Badge>;
    if (total < 150) return <Badge variant="warning">Low</Badge>;
    return <Badge variant="success">Good</Badge>;
  };

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
              <Link to="/donors">Donors</Link>
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
            <h1 className="text-4xl font-bold mb-2 text-foreground">Blood Inventory</h1>
            <p className="text-muted-foreground">Real-time blood unit tracking across PRC network</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="default">
              Record New Unit
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Total Units</div>
              <div className="text-3xl font-bold text-foreground">2,847</div>
              <div className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +8% this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Available</div>
              <div className="text-3xl font-bold text-foreground">2,586</div>
              <div className="text-xs text-muted-foreground mt-1">
                91% of total inventory
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">In Testing</div>
              <div className="text-3xl font-bold text-foreground">163</div>
              <div className="text-xs text-muted-foreground mt-1">
                Awaiting clearance
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Expiring Soon</div>
              <div className="text-3xl font-bold text-warning">98</div>
              <div className="text-xs text-warning flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Within 7 days
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory by Blood Type */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Inventory by Blood Type</CardTitle>
            <CardDescription>Current stock levels and distribution across all units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryData.map((item) => (
                <div key={item.bloodType} className="p-5 border rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Droplets className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{item.bloodType}</div>
                        <div className="text-sm text-muted-foreground">Blood Type</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-foreground">{item.total}</div>
                        <div className="text-xs text-muted-foreground">total units</div>
                      </div>
                      {getStatusBadge(item.total)}
                      {item.trend === "up" && <TrendingUp className="h-5 w-5 text-success" />}
                      {item.trend === "down" && <TrendingDown className="h-5 w-5 text-emergency" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                    <div>
                      <div className="text-sm text-muted-foreground">Available</div>
                      <div className="text-lg font-semibold text-success">{item.available}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">In Testing</div>
                      <div className="text-lg font-semibold text-muted-foreground">{item.inTesting}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Expiring Soon</div>
                      <div className="text-lg font-semibold text-warning">{item.expiringSoon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>PRC centers requiring urgent replenishment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {centerInventory.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{item.center}</span>
                      </div>
                      <Badge variant={item.status === "critical" ? "emergency" : "warning"}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Blood Type: <span className="font-semibold text-foreground">{item.bloodType}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">{item.units}</span> units remaining
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transfers</CardTitle>
              <CardDescription>Blood unit movements between PRC centers</CardDescription>
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
                        <span className="font-semibold text-foreground">{transfer.from}</span>
                        <span>→</span>
                        <span className="font-semibold text-foreground">{transfer.to}</span>
                      </div>
                      <div className="text-foreground font-semibold">{transfer.units} units transferred</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
