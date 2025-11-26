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
import { RecordNewUnit } from "./components/RecordNewUnit";
import { useInventoryPage } from "./inventory.hook";
import Loading from "@/components/loading";
import { useAuth } from "../auth/auth.context";

const Inventory = () => {
  const { session, userProfile } = useAuth();
  const {
    isRecordDialogOpen,
    setIsRecordDialogOpen,
    inventoryData,
    exportToCSV,
    lowStockAlerts,
    isLoading,
    recentTransfers,
    totalUnits,
    availableUnits,
    inTestingUnits,
    expiringSoonUnits,
  } = useInventoryPage();

  const getStatusBadge = (total: number) => {
    if (total < 100) return <Badge variant="emergency">Critical</Badge>;
    if (total < 150) return <Badge variant="warning">Low</Badge>;
    return <Badge variant="success">Good</Badge>;
  };

  if (isLoading) return <Loading component={false} />;

  return (
    <div>
      {/* Navigation */}

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
            <Button
              variant="default"
              onClick={() => setIsRecordDialogOpen(true)}
            >
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
                {totalUnits > 0
                  ? Math.round((availableUnits / totalUnits) * 100)
                  : 0}
                % of total inventory
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

      {/* Record New Unit Dialog */}
      <RecordNewUnit
        open={isRecordDialogOpen}
        onOpenChange={setIsRecordDialogOpen}
      />
    </div>
  );
};

export default Inventory;
