import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Hospital,
  Package
} from "lucide-react";
import { Link } from "react-router-dom";

const Requests = () => {
  const emergencyRequests = [
    { 
      id: 1, 
      hospital: "Manila General Hospital", 
      requestDate: "2025-01-24 14:30",
      urgency: "Emergency",
      items: [
        { bloodType: "O-", requested: 5, fulfilled: 0 }
      ],
      status: "Pending"
    },
    { 
      id: 2, 
      hospital: "Cebu Medical Center", 
      requestDate: "2025-01-24 14:02",
      urgency: "Emergency",
      items: [
        { bloodType: "AB+", requested: 3, fulfilled: 0 }
      ],
      status: "Pending"
    },
  ];

  const urgentRequests = [
    { 
      id: 3, 
      hospital: "Davao Regional Hospital", 
      requestDate: "2025-01-24 13:15",
      urgency: "Urgent",
      items: [
        { bloodType: "A+", requested: 4, fulfilled: 2 }
      ],
      status: "Partially Fulfilled"
    },
    { 
      id: 4, 
      hospital: "Makati Medical Center", 
      requestDate: "2025-01-24 12:45",
      urgency: "Urgent",
      items: [
        { bloodType: "B+", requested: 6, fulfilled: 4 }
      ],
      status: "Partially Fulfilled"
    },
  ];

  const routineRequests = [
    { 
      id: 5, 
      hospital: "St. Luke's Medical Center", 
      requestDate: "2025-01-24 10:00",
      urgency: "Routine",
      items: [
        { bloodType: "O+", requested: 10, fulfilled: 10 }
      ],
      status: "Fulfilled"
    },
    { 
      id: 6, 
      hospital: "Philippine General Hospital", 
      requestDate: "2025-01-24 09:30",
      urgency: "Routine",
      items: [
        { bloodType: "A-", requested: 8, fulfilled: 8 }
      ],
      status: "Fulfilled"
    },
  ];

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Emergency":
        return <Badge variant="emergency">Emergency</Badge>;
      case "Urgent":
        return <Badge variant="warning">Urgent</Badge>;
      default:
        return <Badge variant="outline">Routine</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Fulfilled":
        return <Badge variant="success">Fulfilled</Badge>;
      case "Partially Fulfilled":
        return <Badge variant="warning">Partially Fulfilled</Badge>;
      case "Pending":
        return <Badge variant="emergency">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const RequestCard = ({ request }: { request: any }) => (
    <div className="p-5 border rounded-lg hover:bg-secondary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            request.urgency === "Emergency" ? "bg-emergency/10" :
            request.urgency === "Urgent" ? "bg-warning/10" :
            "bg-primary/10"
          }`}>
            <Hospital className={`h-6 w-6 ${
              request.urgency === "Emergency" ? "text-emergency" :
              request.urgency === "Urgent" ? "text-warning" :
              "text-primary"
            }`} />
          </div>
          <div>
            <div className="font-semibold text-lg text-foreground mb-1">{request.hospital}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {request.requestDate}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getUrgencyBadge(request.urgency)}
          {getStatusBadge(request.status)}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {request.items.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold text-foreground">{item.bloodType}</div>
                <div className="text-sm text-muted-foreground">Blood Type</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-foreground">
                {item.fulfilled} / {item.requested} units
              </div>
              <div className="text-xs text-muted-foreground">
                {item.fulfilled === item.requested ? "Complete" : "In Progress"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {request.status === "Pending" && (
          <>
            <Button variant="success" size="sm" className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Fulfill Request
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </>
        )}
        {request.status === "Partially Fulfilled" && (
          <>
            <Button variant="default" size="sm" className="flex-1">
              <Package className="mr-2 h-4 w-4" />
              Complete Fulfillment
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </>
        )}
        {request.status === "Fulfilled" && (
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        )}
      </div>
    </div>
  );

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
              <Link to="/inventory">Inventory</Link>
            </Button>
            <Button variant="default">Sign In</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">Blood Requests</h1>
            <p className="text-muted-foreground">Manage and fulfill hospital blood requests</p>
          </div>
          <Button variant="default" size="lg" asChild>
            <Link to="/create-request">
              <AlertCircle className="mr-2 h-5 w-5" />
              New Request
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Emergency</div>
                  <div className="text-3xl font-bold text-emergency">{emergencyRequests.length}</div>
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
                  <div className="text-sm text-muted-foreground mb-1">Urgent</div>
                  <div className="text-3xl font-bold text-warning">{urgentRequests.length}</div>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Routine</div>
                  <div className="text-3xl font-bold text-foreground">{routineRequests.length}</div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Fulfilled Today</div>
                  <div className="text-3xl font-bold text-success">12</div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Requests */}
        {emergencyRequests.length > 0 && (
          <Card className="mb-8 border-emergency/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emergency">
                <AlertCircle className="h-5 w-5" />
                Emergency Requests
              </CardTitle>
              <CardDescription>Critical blood requests requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Urgent Requests */}
        {urgentRequests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Urgent Requests
              </CardTitle>
              <CardDescription>Time-sensitive blood requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urgentRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Routine Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Routine Requests</CardTitle>
            <CardDescription>Standard blood requests and fulfillment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routineRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Requests;
