import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

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
                quantity_requested
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
        bloodType: item.blood_type,
        requested: item.quantity_requested,
        fulfilled: 0 // You may need to add fulfilled quantity to your data model
      })) || [],
      status: request.status
    })) || []
  ) || [];

  const emergencyRequests = allRequests.filter((req: any) => req.urgency === "Emergency");
  const urgentRequests = allRequests.filter((req: any) => req.urgency === "Urgent");
  const routineRequests = allRequests.filter((req: any) => req.urgency === "Routine");


  return {
    isLoading,
    setIsLoading,
    allRequests,
    emergencyRequests,
    urgentRequests,
    routineRequests,
    refetch: getBloodRequests.refetch,
  };
};

export default useBloodRequestsPage;

