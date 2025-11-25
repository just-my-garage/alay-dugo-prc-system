import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useBloodRequests = () => {
  const { data: bloodRequestsData, isLoading } = useQuery({
    queryKey: ["blood-requests"],
    queryFn: async () => {
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
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  const allRequests = bloodRequestsData?.flatMap((hospital: any) => 
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
        fulfilled: item.quantity_fulfilled,
        bloodType: item.blood_type,
        requested: item.quantity_requested,
      })) || [],
      status: request.status
    })) || []
  ) || [];

  const pendingRequests = allRequests.filter((req: any) => req.status !== "Fulfilled");
  const emergencyRequests = pendingRequests.filter((req: any) => req.urgency === "Emergency");
  const urgentRequests = pendingRequests.filter((req: any) => req.urgency === "Urgent");
  const routineRequests = pendingRequests.filter((req: any) => req.urgency === "Routine");
  const fulfilledRequests = allRequests.filter((req: any) => req.status === "Fulfilled");

  return {
    allRequests,
    pendingRequests,
    emergencyRequests,
    urgentRequests,
    routineRequests,
    fulfilledRequests,
    isLoading,
  };
};
