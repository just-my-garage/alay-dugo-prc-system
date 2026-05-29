import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Clock, Building2, Users, Droplets, CalendarCheck } from "lucide-react";
import Loading from "@/components/loading";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/pages/auth/auth.context";
import { useState } from "react";
import ScheduleDonationModal from "./ScheduleDonationModal";

const DriveDetails = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();
  const driveIdNum = driveId ? Number(driveId) : null;
  const { session, userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  
  const isDonor = session && !userProfile?.isAdmin;

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
          donors!donations_donor_id_fkey(
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
    const bloodType = donation.donors?.blood_type || "Unknown";
    acc[bloodType] = (acc[bloodType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Main Drive Information */}
        <Card className="mb-6 overflow-hidden border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 via-background to-secondary/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="w-fit rounded-lg bg-primary/10 p-3">
                  <Calendar className="h-7 w-7 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <CardTitle className="break-words text-2xl sm:text-3xl">
                      {drive.drive_name}
                    </CardTitle>
                    {getStatusBadge()}
                  </div>
                  <CardDescription className="text-sm sm:text-base">
                    Complete drive details, schedule, donor activity, and collection progress
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Location Information */}
              <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-secondary/30 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Venue
                    </p>
                    <p className="break-words font-medium text-foreground">
                      {drive.venue_address}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 border-t pt-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        City
                      </p>
                      <p className="text-foreground">{drive.city}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Province
                      </p>
                      <p className="text-foreground">{drive.province}</p>
                    </div>
                  </div>
                </div>
              </div>

              {drive.prc_centers && (
                <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-secondary/30 sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Organizing Center</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        PRC Center
                      </p>
                      <p className="break-words font-medium text-foreground">
                        {drive.prc_centers.center_name}
                      </p>
                    </div>
                    <div className="border-t pt-3">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Address
                      </p>
                      <p className="break-words text-muted-foreground">
                        {drive.prc_centers.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Information */}
              <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-secondary/30 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Schedule</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="rounded-lg bg-primary/5 p-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Start
                    </p>
                    <p className="flex items-start gap-2 font-medium text-foreground">
                      <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>
                        {startDate.toLocaleDateString("en-US", { 
                          weekday: "long", 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        })}
                      </span>
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      {startDate.toLocaleTimeString("en-US", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      End
                    </p>
                    <p className="flex items-start gap-2 font-medium text-foreground">
                      <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>
                        {endDate.toLocaleDateString("en-US", { 
                          weekday: "long", 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        })}
                      </span>
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      {endDate.toLocaleTimeString("en-US", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donor Scheduling Section */}
        {(isUpcoming || isOngoing) && drive.status !== "Cancelled" && (
          <Card className={`mb-6 ${userDonation ? "border-success/20 bg-success/10" : "border-primary/20 bg-primary/5"}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className={`w-fit rounded-lg p-3 ${userDonation ? "bg-success/10" : "bg-primary/10"}`}>
                    <CalendarCheck className={`h-7 w-7 ${userDonation ? "text-success" : "text-primary"}`} />
                  </div>
                  <div>
                    <CardTitle className="mb-2 text-xl sm:text-2xl">
                      {userDonation ? "Donation Scheduled" : "Plan Your Donation"}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {!session 
                        ? "Login to schedule your donation for this drive"
                        : userProfile?.isAdmin
                        ? "Admin accounts cannot schedule donations"
                        : userDonation 
                        ? "You're scheduled for this donation drive"
                        : "Schedule your donation for this drive"
                      }
                    </CardDescription>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant={userDonation ? "success" : "outline"}>
                        {userDonation ? "Confirmed" : isOngoing ? "Open now" : "Upcoming"}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {startDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setModalOpen(true)}
                  size="lg"
                  className="w-full md:w-auto"
                  variant={userDonation ? "outline" : "default"}
                >
                  <CalendarCheck className="h-5 w-5 mr-2" />
                  {userDonation ? "View Donation Details" : "Schedule Donation"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Donation Modal */}
        <ScheduleDonationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          drive={drive}
          session={session}
          userProfile={userProfile}
          userDonation={userDonation}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["user_drive_donation", driveIdNum, userProfile?.donor_id] });
            queryClient.invalidateQueries({ queryKey: ["drive_donations", driveIdNum] });
          }}
        />

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Donors</div>
                  <div className="text-3xl font-bold text-foreground">{totalDonors}</div>
                  <div className="text-xs text-muted-foreground mt-1">Registered for this drive</div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Successful Donations</div>
                  <div className="text-3xl font-bold text-success">{successfulDonations}</div>
                  <div className="text-xs text-muted-foreground mt-1">Passed screening result</div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <Droplets className="h-8 w-8 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                  <div className="text-3xl font-bold text-foreground">
                    {totalDonors > 0 ? Math.round((successfulDonations / totalDonors) * 100) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Successful donors over total</div>
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Blood Type Breakdown</CardTitle>
                  <CardDescription>Distribution of blood types collected</CardDescription>
                </div>
                <Badge variant="outline">{Object.keys(bloodTypeBreakdown).length} types</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(bloodTypeBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([bloodType, count]) => (
                    <div key={bloodType} className="p-4 border rounded-lg bg-card hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Droplets className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-xl font-bold text-foreground">{bloodType}</span>
                        </div>
                        <Badge variant="outline">{count} units</Badge>
                      </div>
                      <div className="border-t pt-3 text-sm text-muted-foreground">
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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>
                    Showing {Math.min(donations.length, 10)} of {donations.length} total donations
                  </CardDescription>
                </div>
                <Badge variant="outline">Latest activity</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donations.slice(0, 10).map((donation) => (
                  <div
                    key={donation.donation_id}
                    className="flex flex-col gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Droplets className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground break-words">
                          {donation.donors?.first_name} {donation.donors?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline">{donation.donors?.blood_type}</Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
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
          <Card className="border-dashed">
            <CardContent className="py-12 sm:py-16">
              <div className="mx-auto max-w-md text-center text-muted-foreground">
                <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground">No donations recorded yet</p>
                <p className="text-sm mt-2">Donations for this drive will appear here once donor activity begins</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </>
  );
};

export default DriveDetails;
