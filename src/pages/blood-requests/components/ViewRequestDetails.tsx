import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Building2,
  Calendar,
  Droplets,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface BloodRequestItem {
  blood_type: string;
  quantity_requested: number;
  quantity_fulfilled?: number;
}

interface BloodRequest {
  request_id: number;
  status: string;
  urgency: string;
  request_datetime: string;
  blood_request_items: BloodRequestItem[];
}

interface Hospital {
  hospital_id: number;
  hospital_name: string;
  address: string;
  city: string;
  province: string;
  blood_requests: BloodRequest[];
}

interface ViewRequestDetailsProps {
  request: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (requestId: number) => void;
}

const ViewRequestDetails = ({
  request,
  open,
  onOpenChange,
  onDelete,
}: ViewRequestDetailsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(request.id);
      setShowDeleteDialog(false);
      onOpenChange(false);
    }
  };
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Emergency":
        return (
          <Badge variant="emergency" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Emergency
          </Badge>
        );
      case "Urgent":
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            Urgent
          </Badge>
        );
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

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Request Details</DialogTitle>
              <DialogDescription>
                Complete information about this blood request
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Hospital Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Hospital Information</h3>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Hospital Name
                </div>
                <div className="font-semibold text-foreground">
                  {request.hospital}
                </div>
              </div>
              {request.hospitalData && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Address
                    </div>
                    <div className="text-sm text-foreground">
                      {request.hospitalData.address}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        City
                      </div>
                      <div className="text-sm text-foreground">
                        {request.hospitalData.city}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Province
                      </div>
                      <div className="text-sm text-foreground">
                        {request.hospitalData.province}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Request Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Request Information</h3>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Request ID
                  </div>
                  <div className="font-mono text-sm">#{request.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Request Date
                  </div>
                  <div className="text-sm">
                    {request.requestDateTime
                      ? formatDateTime(request.requestDateTime)
                      : request.requestDate}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Urgency Level
                  </div>
                  {getUrgencyBadge(request.urgency)}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Status
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Blood Request Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Blood Requirements</h3>
            </div>
            <div className="space-y-3">
              {request.items.map((item: any, index: number) => {
                const progress = (item.fulfilled / item.requested) * 100;
                return (
                  <div
                    key={index}
                    className="bg-secondary/30 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Droplets className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">
                            {item.bloodType}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Blood Type
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {item.fulfilled} / {item.requested}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Units
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {request.items.reduce(
                    (sum: number, item: any) => sum + item.requested,
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Requested
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {request.items.reduce(
                    (sum: number, item: any) => sum + item.fulfilled,
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Fulfilled
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {request.items.reduce(
                    (sum: number, item: any) =>
                      sum + (item.requested - item.fulfilled),
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this blood request and all associated
              items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default ViewRequestDetails;
