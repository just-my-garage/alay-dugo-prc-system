import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Clock, Building2, Users, Droplets, CalendarCheck } from "lucide-react";
import Loading from "@/components/loading";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/pages/auth/auth.context";
import { toast } from "sonner";

const DriveDetails = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  const driveIdNum = driveId ? Number(driveId) : null;
  const { session, userProfile } = useAuth();
  const queryClient = useQueryClient();
  
  const isDonor = session && !userProfile?.is_admin;

  // Fetch donation drive details
  const { data: drive, isLoading: isDriveLoading } = useQuery({
    queryKey: ["donation_drive", driveIdNum],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donation_drives")
        .select(`
          *,
          prc_centers (
            center_name,
            address
          )
        `)
        .eq("drive_id", driveIdNum)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!driveIdNum,
  });

  // Fetch donations associated with this drive
  const { data: donations = [], isLoading: isDonationsLoading } = useQuery({
    queryKey: ["drive_donations", driveIdNum],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          users (
            first_name,
            last_name,
            blood_type
          )
        `)
        .eq("drive_id", driveIdNum);

      if (error) throw error;
      return data;
    },
    enabled: !!driveIdNum,
  });

  // Check if current donor has scheduled for this drive
  const { data: userDonation } = useQuery({
    queryKey: ["user_drive_donation", driveIdNum, userProfile?.donor_id],
    queryFn: async () => {
      if (!userProfile?.donor_id || !driveIdNum) return null;
      
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("drive_id", driveIdNum)
        .eq("donor_id", userProfile.donor_id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!driveIdNum && !!userProfile?.donor_id && isDonor,
  });

  // Schedule donation mutation
  const scheduleDonation = useMutation({
    mutationFn: async () => {
      if (!userProfile?.donor_id || !driveIdNum) {
        throw new Error("Missing required information");
      }

      const { error } = await supabase
        .from("donations")
        .insert({
          donor_id: userProfile.donor_id,
          drive_id: driveIdNum,
          donation_date: drive?.start_datetime.split('T')[0] || new Date().toISOString().split('T')[0],
          donation_location_type: "Drive",
          screening_result: "Passed",
          notes: "Scheduled donation"
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_drive_donation", driveIdNum, userProfile?.donor_id] });
      queryClient.invalidateQueries({ queryKey: ["drive_donations", driveIdNum] });
      toast.success("Donation scheduled successfully!");
    },
    onError: (error) => {
      toast.error("Failed to schedule donation: " + error.message);
    }
  });

  // Cancel donation mutation
  const cancelDonation = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["user_drive_donation", driveIdNum, userProfile?.donor_id] });
      queryClient.invalidateQueries({ queryKey: ["drive_donations", driveIdNum] });
      toast.success("Donation cancelled successfully!");
    },
    onError: (error) => {
      toast.error("Failed to cancel donation: " + error.message);
    }
  });

  if (isDriveLoading || isDonationsLoading) {
    return <Loading component={false} />;
  }

  if (!drive) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Donation Drive Not Found</h2>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const startDate = new Date(drive.start_datetime);
  const endDate = new Date(drive.end_datetime);
  const now = new Date();
  
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isPast = endDate < now;

  const getStatusBadge = () => {
    if (drive.status === "Completed") return <Badge variant="default">Completed</Badge>;
    if (drive.status === "Cancelled") return <Badge variant="destructive">Cancelled</Badge>;
    if (isOngoing) return <Badge variant="success">Ongoing</Badge>;
    if (isUpcoming) return <Badge variant="outline">Upcoming</Badge>;
    if (isPast) return <Badge variant="secondary">Past</Badge>;
    return <Badge variant="outline">{drive.status}</Badge>;
  };

  // Calculate statistics
  const totalDonors = donations.length;
  const successfulDonations = donations.filter(d => d.screening_result === "Passed").length;
  const bloodTypeBreakdown = donations.reduce((acc, donation) => {
    const bloodType = donation.users?.blood_type || "Unknown";
    acc[bloodType] = (acc[bloodType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Main Drive Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl">{drive.drive_name}</CardTitle>
                  {getStatusBadge()}
                </div>
                <CardDescription className="text-base">
                  Donation Drive Details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Location Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span className="font-medium text-foreground">Venue:</span>
                      {drive.venue_address}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-foreground">City:</span>
                      {drive.city}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium text-foreground">Province:</span>
                      {drive.province}
                    </p>
                  </div>
                </div>

                {drive.prc_centers && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Organizing Center
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p className="font-medium text-foreground">{drive.prc_centers.center_name}</p>
                      <p>{drive.prc_centers.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Schedule
                  </h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground mb-1">Start</p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {startDate.toLocaleDateString("en-US", { 
                          weekday: "long", 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        })}
                      </p>
                      <p className="flex items-center gap-2 ml-6">
                        <Clock className="h-4 w-4" />
                        {startDate.toLocaleTimeString("en-US", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">End</p>
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {endDate.toLocaleDateString("en-US", { 
                          weekday: "long", 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        })}
                      </p>
                      <p className="flex items-center gap-2 ml-6">
                        <Clock className="h-4 w-4" />
                        {endDate.toLocaleTimeString("en-US", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donor Scheduling Section */}
        {isDonor && (isUpcoming || isOngoing) && drive.status !== "Cancelled" && (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                Donation Scheduling
              </CardTitle>
              <CardDescription>
                {userDonation 
                  ? "You're scheduled for this donation drive"
                  : "Schedule your donation for this drive"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userDonation ? (
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <CalendarCheck className="h-5 w-5 text-success" />
                      <span className="font-semibold text-success">Scheduled</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You're scheduled to donate on {new Date(userDonation.donation_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                    {userDonation.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Note: {userDonation.notes}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => cancelDonation.mutate()}
                    disabled={cancelDonation.isPending}
                  >
                    {cancelDonation.isPending ? "Cancelling..." : "Cancel Donation"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Join this donation drive and help save lives!
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        Scheduled Date: {startDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => scheduleDonation.mutate()}
                    disabled={scheduleDonation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {scheduleDonation.isPending ? "Scheduling..." : "Schedule My Donation"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Donors</div>
                  <div className="text-3xl font-bold text-foreground">{totalDonors}</div>
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
                  <div className="text-sm text-muted-foreground mb-1">Successful Donations</div>
                  <div className="text-3xl font-bold text-foreground">{successfulDonations}</div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <Droplets className="h-8 w-8 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                  <div className="text-3xl font-bold text-foreground">
                    {totalDonors > 0 ? Math.round((successfulDonations / totalDonors) * 100) : 0}%
                  </div>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blood Type Breakdown */}
        {Object.keys(bloodTypeBreakdown).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Blood Type Breakdown</CardTitle>
              <CardDescription>Distribution of blood types collected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(bloodTypeBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([bloodType, count]) => (
                    <div key={bloodType} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-foreground">{bloodType}</span>
                        <Badge variant="outline">{count} units</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {totalDonors > 0 ? Math.round((count / totalDonors) * 100) : 0}% of total
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Donations */}
        {donations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>
                Showing {Math.min(donations.length, 10)} of {donations.length} total donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donations.slice(0, 10).map((donation) => (
                  <div
                    key={donation.donation_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded">
                        <Droplets className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {donation.users?.first_name} {donation.users?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline">{donation.users?.blood_type}</Badge>
                          <span>
                            {new Date(donation.donation_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        donation.screening_result === "Passed"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {donation.screening_result}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {donations.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No donations recorded yet for this drive</p>
                <p className="text-sm mt-2">Donations will appear here once the drive begins</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </>
  );
};

export default DriveDetails;
