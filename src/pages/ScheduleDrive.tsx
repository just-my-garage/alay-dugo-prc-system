import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";

const driveSchema = z.object({
  drive_name: z.string().min(3, "Drive name must be at least 3 characters"),
  venue_address: z.string().min(5, "Venue address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  start_datetime: z.string().min(1, "Start date and time is required"),
  end_datetime: z.string().min(1, "End date and time is required"),
}).refine((data) => new Date(data.end_datetime) > new Date(data.start_datetime), {
  message: "End date must be after start date",
  path: ["end_datetime"],
});

type DriveFormData = z.infer<typeof driveSchema>;

const ScheduleDrive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriveFormData>({
    resolver: zodResolver(driveSchema),
  });

  const onSubmit = async (data: DriveFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("donation_drives")
        .insert([
          {
            drive_name: data.drive_name,
            venue_address: data.venue_address,
            city: data.city,
            province: data.province,
            start_datetime: data.start_datetime,
            end_datetime: data.end_datetime,
            status: "Planned",
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Donation drive has been scheduled successfully.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule donation drive",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Schedule New Donation Drive</CardTitle>
            <CardDescription>
              Create a new blood donation drive event for your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="drive_name">Drive Name</Label>
                <Input
                  id="drive_name"
                  placeholder="e.g., Manila Community Blood Drive 2025"
                  {...register("drive_name")}
                />
                {errors.drive_name && (
                  <p className="text-sm text-destructive">{errors.drive_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue_address">Venue Address</Label>
                <Textarea
                  id="venue_address"
                  placeholder="Complete venue address"
                  {...register("venue_address")}
                />
                {errors.venue_address && (
                  <p className="text-sm text-destructive">{errors.venue_address.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    placeholder="Province"
                    {...register("province")}
                  />
                  {errors.province && (
                    <p className="text-sm text-destructive">{errors.province.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_datetime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Start Date & Time
                  </Label>
                  <Input
                    id="start_datetime"
                    type="datetime-local"
                    {...register("start_datetime")}
                  />
                  {errors.start_datetime && (
                    <p className="text-sm text-destructive">{errors.start_datetime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_datetime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    End Date & Time
                  </Label>
                  <Input
                    id="end_datetime"
                    type="datetime-local"
                    {...register("end_datetime")}
                  />
                  {errors.end_datetime && (
                    <p className="text-sm text-destructive">{errors.end_datetime.message}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Drive"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleDrive;
