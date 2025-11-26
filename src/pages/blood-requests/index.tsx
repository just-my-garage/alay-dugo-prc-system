import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Droplets,
  AlertCircle,
  Clock,
  CheckCircle,
  Hospital,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import useBloodRequestsPage from "./requests.hook";
import Loading from "@/components/loading";
import FulfillRequest from "./components/FulfillRequest";
import ViewRequestDetails from "./components/ViewRequestDetails";
import { useState } from "react";
import { useAuth } from "../auth/auth.context";

const Requests = () => {
  const { session, userProfile } = useAuth();
  const {
    isLoading,
    allRequests,
    pendingRequests,
    emergencyRequests,
    urgentRequests,
    routineRequests,
    fulfilledRequests,
    refetch,
    deleteRequest,
  } = useBloodRequestsPage();

  const [fulfillDialogOpen, setFulfillDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [viewDetailsRequest, setViewDetailsRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleFulfillClick = (request: any) => {
    setSelectedRequest(request);
    setFulfillDialogOpen(true);
  };

  const handleViewDetailsClick = (request: any) => {
    setViewDetailsRequest(request);
    setViewDetailsOpen(true);
  };

  // Process data from API

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
          <div
            className={`p-3 rounded-lg ${
              request.urgency === "Emergency"
                ? "bg-emergency/10"
                : request.urgency === "Urgent"
                ? "bg-warning/10"
                : "bg-primary/10"
            }`}
          >
            <Hospital
              className={`h-6 w-6 ${
                request.urgency === "Emergency"
                  ? "text-emergency"
                  : request.urgency === "Urgent"
                  ? "text-warning"
                  : "text-primary"
              }`}
            />
          </div>
          <div>
            <div className="font-semibold text-lg text-foreground mb-1">
              {request.hospital}
            </div>
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
        {request.items.map((item: any, index: number) => {
          const progress = (item.fulfilled / item.requested) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    {item.bloodType}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.fulfilled} / {item.requested} units
                </span>
              </div>
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progress === 100
                      ? "bg-success"
                      : progress > 0
                      ? "bg-warning"
                      : "bg-muted"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        {session && userProfile?.is_admin && (
          <>
            {request.status !== "Fulfilled" && (
              <button
                onClick={() => handleFulfillClick(request)}
                className={`flex-1 relative overflow-hidden rounded-md border transition-all hover:scale-[1.02] ${
                  request.status === "Pending"
                    ? "border-success/20 bg-success/5 hover:bg-success/10"
                    : "border-warning/20 bg-warning/5 hover:bg-warning/10"
                }`}
              >
                <div className="relative z-10 flex items-center justify-center gap-2 py-2 px-4">
                  {request.status === "Pending" ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium text-success">
                        Fulfill Request
                      </span>
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 text-warning" />
                      <span className="font-medium text-warning">
                        Complete Fulfillment
                      </span>
                    </>
                  )}
                </div>
                <div
                  className={`absolute inset-0 transition-all ${
                    request.status === "Pending"
                      ? "bg-success/10"
                      : "bg-warning/10"
                  }`}
                  style={{
                    width: `${
                      (request.items.reduce(
                        (sum: number, item: any) => sum + item.fulfilled,
                        0
                      ) /
                        request.items.reduce(
                          (sum: number, item: any) => sum + item.requested,
                          0
                        )) *
                      100
                    }%`,
                  }}
                />
              </button>
            )}
            {request.status === "Fulfilled" && (
              <div className="flex-1 relative overflow-hidden rounded-md border border-success/20 bg-success/10">
                <div className="flex items-center justify-center gap-2 py-2 px-4">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">Fulfilled</span>
                </div>
              </div>
            )}
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDetailsClick(request)}
          className="w-auto"
        >
          View Details
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return <Loading component={false} />;
  }

  return (
    <>
      {/* Navigation */}
      <div className="container mx-auto px-4 py-8 lg:grid grid-cols-3 gap-4">
        {/* Header */}
        <div className="mb-0.5 space-y-2 lg:sticky lg:top-28 lg:self-start lg:h-fit">
          <div className="mb-8 lg:mb-4 flex lg:block items-center justify-between space-y-3 pr-9">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-foreground">
                Blood Requests
              </h1>
              <p className="text-muted-foreground">
                Manage and fulfill hospital blood requests
              </p>
            </div>
            {session && userProfile?.is_admin && (
              <Button variant="default" size="lg" asChild className="lg:mt-8">
                <Link to="/create-request">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  New Request
                </Link> 
              </Button>
            )}
          </div>

          {/* Summary Cards */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Emergency
                  </div>
                  <div className="text-3xl font-bold text-emergency">
                    {emergencyRequests.length}
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
                    Urgent
                  </div>
                  <div className="text-3xl font-bold text-warning">
                    {urgentRequests.length}
                  </div>
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
                  <div className="text-sm text-muted-foreground mb-1">
                    Routine
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {routineRequests.length}
                  </div>
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
                  <div className="text-sm text-muted-foreground mb-1">
                    Fulfilled Today
                  </div>
                  <div className="text-3xl font-bold text-success">
                    {
                      allRequests.filter(
                        (req: any) => req.status === "Fulfilled"
                      ).length
                    }
                  </div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all">
                All ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger
                value="emergency"
                className="data-[state=active]:text-emergency"
              >
                Emergency ({emergencyRequests.length})
              </TabsTrigger>
              <TabsTrigger
                value="urgent"
                className="data-[state=active]:text-warning"
              >
                Urgent ({urgentRequests.length})
              </TabsTrigger>
              <TabsTrigger value="routine">
                Routine ({routineRequests.length})
              </TabsTrigger>
              <TabsTrigger
                value="fulfilled"
                className="data-[state=active]:text-success"
              >
                Fulfilled ({fulfilledRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Pending Requests</CardTitle>
                  <CardDescription>
                    View all pending blood requests across all priority levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending requests found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency">
              <Card className="border-emergency/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emergency">
                    <AlertCircle className="h-5 w-5" />
                    Emergency Requests
                  </CardTitle>
                  <CardDescription>
                    Critical blood requests requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {emergencyRequests.length > 0 ? (
                    <div className="space-y-4">
                      {emergencyRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No emergency requests at this time
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="urgent">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-warning" />
                    Urgent Requests
                  </CardTitle>
                  <CardDescription>
                    Time-sensitive blood requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {urgentRequests.length > 0 ? (
                    <div className="space-y-4">
                      {urgentRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No urgent requests at this time
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="routine">
              <Card>
                <CardHeader>
                  <CardTitle>Routine Requests</CardTitle>
                  <CardDescription>
                    Standard blood requests and fulfillment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {routineRequests.length > 0 ? (
                    <div className="space-y-4">
                      {routineRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No routine requests at this time
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fulfilled">
              <Card className="border-success/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    Fulfilled Requests
                  </CardTitle>
                  <CardDescription>
                    Completed blood requests with full fulfillment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {fulfilledRequests.length > 0 ? (
                    <div className="space-y-4">
                      {fulfilledRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No fulfilled requests yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Fulfill Request Dialog */}
      {selectedRequest && (
        <FulfillRequest
          request={selectedRequest}
          open={fulfillDialogOpen}
          onOpenChange={setFulfillDialogOpen}
          onSuccess={() => refetch()}
        />
      )}

      {/* View Request Details Dialog */}
      {viewDetailsRequest && (
        <ViewRequestDetails
          request={viewDetailsRequest}
          open={viewDetailsOpen}
          onOpenChange={setViewDetailsOpen}
          onDelete={(requestId) => deleteRequest.mutate(requestId)}
          session={session}
          userProfile={userProfile}
        />
      )}
    </>
  );
};

export default Requests;
