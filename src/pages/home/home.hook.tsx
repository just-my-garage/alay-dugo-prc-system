import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useBloodInventory } from "@/hooks/use-blood-inventory";
import { useBloodRequests } from "@/hooks/use-blood-requests";

const useHome = () => {
  const { totalUnits } = useBloodInventory();
  const { emergencyRequests, urgentRequests } = useBloodRequests();

  // Fetch active donors count
   const { data: activeDonorsCount = 0, isLoading: isLoadingDonors } = useQuery({
    queryKey: ["active-donors-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("eligibility_status", "Eligible");

      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch blood inventory from database
  const { data: inventoryStatus = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ["blood-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_units")
        .select("blood_type")
        .eq("status", "In-Storage");

      if (error) throw error;

      // Count units by blood type
      const counts = data.reduce((acc, unit) => {
        acc[unit.blood_type] = (acc[unit.blood_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Define all blood types
      const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

      // Map to inventory status with thresholds
      return bloodTypes.map((bloodType) => {
        const units = counts[bloodType] || 0;
        let status: "good" | "medium" | "low" | "critical";

        if (units >= 200) status = "good";
        else if (units >= 100) status = "medium";
        else if (units >= 75) status = "low";
        else status = "critical";

        return { bloodType, units, status };
      });
    },
  });

  const { data: donationDrives, isLoading: isLoadingDrives } = useQuery({
    queryKey: ["donation_drives"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donation_drives")
        .select("*")
        .order("start_datetime", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const isLoading = isLoadingDonors || isLoadingInventory || isLoadingDrives;

  return {
    totalUnits,
    emergencyRequests,
    urgentRequests,
    activeDonorsCount,
    inventoryStatus,
    donationDrives,
    isLoading,
  };
};

export default useHome;
