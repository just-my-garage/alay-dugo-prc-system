import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ScheduleDonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drive: {
    drive_id: number;
    drive_name: string;
    venue_address: string;
    city: string;
    province: string;
    start_datetime: string;
    end_datetime: string;
    organizing_center_id?: number | null;
  };
  session: any;
  userProfile: any;
  userDonation: any;
  onSuccess?: () => void;
}

const ScheduleDonationModal = ({
  open,
  onOpenChange,
  drive,
  session,
  userProfile,
  userDonation,
  onSuccess,
}: ScheduleDonationModalProps) => {
  const queryClient = useQueryClient();
  const [isConfirming, setIsConfirming] = useState(false);

  const startDate = new Date(drive.start_datetime);
  const endDate = new Date(drive.end_datetime);

  // Schedule donation mutation
  const scheduleMutation = useMutation({
    mutationFn: async () => {
      if (!drive.drive_id) {
        throw new Error("Missing required information");
      }

      const { error } = await supabase
        .from("donations")
        .insert({
          donor_id: userProfile.donor_id,
          drive_id: drive.drive_id,
          center_id: drive.organizing_center_id || null,
          donation_date: drive.start_datetime.split('T')[0],
          donation_location_type: "Drive",
          screening_result: "Passed",
          notes: "Scheduled donation",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_drive_donation"] });
      queryClient.invalidateQueries({ queryKey: ["drive_donations"] });
      toast.success("Donation scheduled successfully!");
      setIsConfirming(false);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error("Failed to schedule donation: " + error.message);
      setIsConfirming(false);
    },
  });

  // Cancel donation mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!userDonation?.donation_id) {
        throw new Error("No donation to cancel");
      }

      const { error } = await supabase
        .from("donations")
        .delete()
        .eq("donation_id", userDonation.donation_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_drive_donation"] });
      queryClient.invalidateQueries({ queryKey: ["drive_donations"] });
      toast.success("Donation cancelled successfully!");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error("Failed to cancel donation: " + error.message);
    },
  });

  const handleSchedule = () => {
    if (!isConfirming) {
      setIsConfirming(true);
    } else {
      scheduleMutation.mutate();
    }
  };

  const handleCancel = () => {
    cancelMutation.mutate();
  };

  // Not logged in
  if (!session) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to schedule a donation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">{drive.drive_name}</p>
                  <p className="text-sm text-muted-foreground">{drive.venue_address}</p>
                  <p className="text-sm text-muted-foreground">{drive.city}, {drive.province}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {startDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {startDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {endDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Ready to save lives?</p>
                <p className="text-muted-foreground">
                  Login or register to schedule your donation appointment and join us in making a difference.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/donor-login" onClick={() => onOpenChange(false)}>
                Login
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link to="/donor-register" onClick={() => onOpenChange(false)}>
                Register
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Admin user
  if (userProfile?.is_admin) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Admin Account</DialogTitle>
            <DialogDescription>
              Admin accounts cannot schedule donations
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Admin accounts are for managing the blood bank system and cannot schedule donations. 
                Please use a donor account to schedule a donation appointment.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Already scheduled
  if (userDonation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Donation Scheduled</DialogTitle>
            <DialogDescription>
              You're already scheduled for this donation drive
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <span className="font-semibold text-success text-lg">Confirmed</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{drive.drive_name}</p>
                    <p className="text-muted-foreground">{drive.venue_address}</p>
                    <p className="text-muted-foreground">{drive.city}, {drive.province}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {new Date(userDonation.donation_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      {startDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {endDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              {userDonation.notes && (
                <div className="mt-3 pt-3 border-t border-success/20">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Note:</span> {userDonation.notes}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Important Reminders:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Get adequate rest the night before</li>
                  <li>Eat a healthy meal before donating</li>
                  <li>Bring a valid ID</li>
                  <li>Stay hydrated</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="w-full sm:w-auto"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Donation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Schedule new donation
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isConfirming ? "Confirm Your Donation" : "Schedule Donation"}
          </DialogTitle>
          <DialogDescription>
            {isConfirming
              ? "Please review your donation details"
              : "Schedule your blood donation appointment"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">{drive.drive_name}</p>
                <p className="text-sm text-muted-foreground">{drive.venue_address}</p>
                <p className="text-sm text-muted-foreground">{drive.city}, {drive.province}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {startDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {startDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {endDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {isConfirming ? (
            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-2">Before you confirm:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Ensure you're feeling healthy</li>
                  <li>You haven't donated in the last 8 weeks</li>
                  <li>You can commit to this date and time</li>
                  <li>You'll bring a valid ID</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">What to expect:</p>
                <p className="text-muted-foreground">
                  Your donation will help save lives. The process typically takes 30-45 minutes, 
                  including registration, screening, donation, and refreshments.
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (isConfirming) {
                setIsConfirming(false);
              } else {
                onOpenChange(false);
              }
            }}
            disabled={scheduleMutation.isPending}
            className="w-full sm:w-auto"
          >
            {isConfirming ? "Back" : "Cancel"}
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={scheduleMutation.isPending}
            className="w-full sm:w-auto"
          >
            {scheduleMutation.isPending
              ? "Scheduling..."
              : isConfirming
              ? "Confirm Donation"
              : "Schedule Donation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDonationModal;
