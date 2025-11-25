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
    refetch: () => queryClient.invalidateQueries({ queryKey: ["blood-requests"] }),
    deleteRequest,
  };
};

export default useBloodRequestsPage;

