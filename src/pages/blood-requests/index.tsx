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
    <div className="p-4 sm:p-5 border rounded-lg hover:bg-secondary/50 transition-colors">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
        <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
          <div
            className={`p-2.5 sm:p-3 rounded-lg flex-shrink-0 ${
              request.urgency === "Emergency"
                ? "bg-emergency/10"
                : request.urgency === "Urgent"
                ? "bg-warning/10"
                : "bg-primary/10"
            }`}
          >
            <Hospital
              className={`h-5 w-5 sm:h-6 sm:w-6 ${
                request.urgency === "Emergency"
                  ? "text-emergency"
                  : request.urgency === "Urgent"
                  ? "text-warning"
                  : "text-primary"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base sm:text-lg text-foreground mb-1 break-words">
              {request.hospital}
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{request.requestDate}</span>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col flex-row items-start sm:items-end gap-2 w-full sm:w-auto">
          {getUrgencyBadge(request.urgency)}
          {getStatusBadge(request.status)}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {request.items.map((item: any, index: number) => {
          const progress = (item.fulfilled / item.requested) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Droplets className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-semibold text-foreground text-sm truncate">
                    {item.bloodType}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
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

      <div className="flex flex-col sm:flex-row gap-2">
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
                <div className="relative z-10 flex items-center justify-center gap-2 py-2 px-3 sm:px-4">
                  {request.status === "Pending" ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="font-medium text-success text-sm sm:text-base">
                        Fulfill Request
                      </span>
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 text-warning flex-shrink-0" />
                      <span className="font-medium text-warning text-sm sm:text-base">
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
                <div className="flex items-center justify-center gap-2 py-2 px-3 sm:px-4">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  <span className="font-medium text-success text-sm sm:text-base">Fulfilled</span>
                </div>
              </div>
            )}
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDetailsClick(request)}
          className="w-full sm:w-auto"
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
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 lg:grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Header */}
        <div className="mb-4 lg:mb-0.5 space-y-3 lg:space-y-2 lg:sticky lg:top-28 lg:self-start lg:h-fit">
          <div className="mb-6 lg:mb-4 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start justify-between space-y-4 sm:space-y-0 lg:space-y-3">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-foreground">
                Blood Requests
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage and fulfill hospital blood requests
              </p>
            </div>
            {session && userProfile?.is_admin && (
              <Button variant="default" size="lg" asChild className="w-full sm:w-auto lg:w-full lg:mt-8">
                <Link to="/create-request">
                  <AlertCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  New Request
                </Link> 
              </Button>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3 lg:space-y-0">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Emergency
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-emergency">
                      {emergencyRequests.length}
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-emergency/10 rounded-lg">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emergency" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Urgent
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-warning">
                      {urgentRequests.length}
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-warning/10 rounded-lg">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Routine
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {routineRequests.length}
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Fulfilled Today
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-success">
                      {
                        allRequests.filter(
                          (req: any) => req.status === "Fulfilled"
                        ).length
                      }
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-success/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-4 sm:mb-6 h-auto overflow-x-auto">
              <TabsTrigger value="all" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                All ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger
                value="emergency"
                className="data-[state=active]:text-emergency text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
              >
                Emergency ({emergencyRequests.length})
              </TabsTrigger>
              <TabsTrigger
                value="urgent"
                className="data-[state=active]:text-warning text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
              >
                Urgent ({urgentRequests.length})
              </TabsTrigger>
              <TabsTrigger value="routine" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                Routine ({routineRequests.length})
              </TabsTrigger>
              <TabsTrigger
                value="fulfilled"
                className="data-[state=active]:text-success text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
              >
                Fulfilled ({fulfilledRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">All Pending Requests</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    View all pending blood requests across all priority levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {pendingRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">
                      No pending requests found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency">
              <Card className="border-emergency/20">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-emergency text-lg sm:text-xl">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Emergency Requests
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Critical blood requests requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {emergencyRequests.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {emergencyRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">
                      No emergency requests at this time
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="urgent">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
                    Urgent Requests
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Time-sensitive blood requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {urgentRequests.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {urgentRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">
                      No urgent requests at this time
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="routine">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">Routine Requests</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Standard blood requests and fulfillment history
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {routineRequests.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {routineRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">
                      No routine requests at this time
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fulfilled">
              <Card className="border-success/20">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-success text-lg sm:text-xl">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Fulfilled Requests
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Completed blood requests with full fulfillment
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {fulfilledRequests.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {fulfilledRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">
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