import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const useBloodRequestsPage = () => {
  // CONTAINING ALL CRUD OPERATIONS FOR BLOOD REQUESTS PAGE
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBloodRequests = useQuery({
    queryKey: ["blood-requests"],
    queryFn: async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("hospitals").select(`
          *,
          blood_requests (
            request_id,
            urgency,
            status,
            request_datetime,
              blood_request_items (
                blood_type,
                quantity_requested,
                quantity_fulfilled
              )
          )
        `);
      setIsLoading(false);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

    const allRequests = getBloodRequests.data?.flatMap((hospital: any) => 
    hospital.blood_requests?.map((request: any) => ({
      id: request.request_id,
      hospital: hospital.hospital_name,
      requestDate: new Date(request.request_datetime).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      urgency: request.urgency,
      items: request.blood_request_items?.map((item: any) => ({
        fulfilled: item.quantity_fulfilled, // You may need to add fulfilled quantity to your data model
        bloodType: item.blood_type,
        requested: item.quantity_requested,
      })) || [],
      status: request.status
    })) || []
  ) || [];

  const emergencyRequests = allRequests.filter((req: any) => req.urgency === "Emergency");
  const urgentRequests = allRequests.filter((req: any) => req.urgency === "Urgent");
  const routineRequests = allRequests.filter((req: any) => req.urgency === "Routine");

  const deleteRequest = useMutation({
    mutationFn: async (requestId: number) => {
      // First delete blood_request_items (if they have foreign key constraints)
      const { error: itemsError } = await supabase
        .from("blood_request_items")
        .delete()
        .eq("request_id", requestId);

      if (itemsError) throw itemsError;

      // Then delete the blood request
      const { error } = await supabase
        .from("blood_requests")
        .delete()
        .eq("request_id", requestId);

      if (error) throw error;
      
      return requestId;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blood request deleted successfully",
      });
      getBloodRequests.refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blood request",
        variant: "destructive",
      });
    },
  });

  return {
    isLoading,
    setIsLoading,
    allRequests,
    emergencyRequests,
    urgentRequests,
    routineRequests,
    refetch: getBloodRequests.refetch,
    deleteRequest,
  };
};

export default useBloodRequestsPage;

