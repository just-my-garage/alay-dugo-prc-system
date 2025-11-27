import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useBloodRequests } from "@/hooks/use-blood-requests";

const useBloodRequestsPage = () => {
  // CONTAINING ALL CRUD OPERATIONS FOR BLOOD REQUESTS PAGE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Use shared blood requests hook
  const {
    allRequests,
    pendingRequests,
    emergencyRequests,
    urgentRequests,
    routineRequests,
    fulfilledRequests,
    isLoading: isLoadingRequests,
  } = useBloodRequests();

  // Track admin's own requests in localStorage
  const getTrackedRequests = (): number[] => {
    const tracked = localStorage.getItem("admin_tracked_requests");
    return tracked ? JSON.parse(tracked) : [];
  };

  const trackRequest = (requestId: number) => {
    const tracked = getTrackedRequests();
    if (!tracked.includes(requestId)) {
      localStorage.setItem("admin_tracked_requests", JSON.stringify([...tracked, requestId]));
    }
  };

  const untrackRequest = (requestId: number) => {
    const tracked = getTrackedRequests();
    localStorage.setItem(
      "admin_tracked_requests",
      JSON.stringify(tracked.filter((id) => id !== requestId))
    );
  };

  // Filter requests that are tracked by the admin
  const myRequests = allRequests.filter((req: any) => 
    getTrackedRequests().includes(req.id)
  );

  const myPendingRequests = myRequests.filter((req: any) => req.status !== "Fulfilled");

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
      // Refetch the blood requests query
      queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
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
    isLoading: isLoading || isLoadingRequests,
    setIsLoading,
    allRequests,
    pendingRequests,
    emergencyRequests,
    urgentRequests,
    routineRequests,
    fulfilledRequests,
    myRequests,
    myPendingRequests,
    trackRequest,
    untrackRequest,
    getTrackedRequests,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["blood-requests"] }),
    deleteRequest,
  };
};

export default useBloodRequestsPage;

