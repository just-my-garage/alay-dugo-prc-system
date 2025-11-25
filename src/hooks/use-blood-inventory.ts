import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InventoryItem {
  bloodType: string;
  total: number;
  available: number;
  inTesting: number;
  expiringSoon: number;
  trend: "up" | "down" | "stable";
}

export const useBloodInventory = () => {
  // Fetch blood units data from database
  const { data: bloodUnits = [], isLoading } = useQuery({
    queryKey: ["blood-units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_units")
        .select("blood_type, status, expiry_date");
      
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate inventory data from database
  const inventoryData: InventoryItem[] = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bloodType) => {
    const unitsOfType = bloodUnits.filter((unit) => unit.blood_type === bloodType);
    const total = unitsOfType.length;
    const available = unitsOfType.filter((unit) => unit.status === "In-Storage").length;
    const inTesting = unitsOfType.filter((unit) => unit.status === "In-Testing").length;
    
    // Calculate expiring soon (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringSoon = unitsOfType.filter((unit) => {
      const expiryDate = new Date(unit.expiry_date);
      return expiryDate <= sevenDaysFromNow && expiryDate >= new Date();
    }).length;

    return {
      bloodType,
      total,
      available,
      inTesting,
      expiringSoon,
      trend: "stable" as const,
    };
  });

  // Calculate summary statistics
  const totalUnits = inventoryData.reduce((sum, item) => sum + item.total, 0);
  const availableUnits = inventoryData.reduce((sum, item) => sum + item.available, 0);
  const inTestingUnits = inventoryData.reduce((sum, item) => sum + item.inTesting, 0);
  const expiringSoonUnits = inventoryData.reduce((sum, item) => sum + item.expiringSoon, 0);

  return {
    bloodUnits,
    inventoryData,
    totalUnits,
    availableUnits,
    inTestingUnits,
    expiringSoonUnits,
    isLoading,
  };
};
