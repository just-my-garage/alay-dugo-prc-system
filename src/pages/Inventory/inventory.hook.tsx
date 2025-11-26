import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBloodInventory } from "@/hooks/use-blood-inventory";
import { useState } from "react";

export const useInventoryPage = () => {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use shared blood inventory hook
  const {
    inventoryData,
    totalUnits,
    availableUnits,
    inTestingUnits,
    expiringSoonUnits,
  } = useBloodInventory();

  // Fetch urgent blood requests for low stock alerts
  const { data: lowStockAlerts = [] } = useQuery({
    queryKey: ["low-stock-alerts"],
    queryFn: async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("blood_requests")
        .select(
          `
          request_id,
          urgency,
          status,
          hospitals (hospital_name),
          blood_request_items (
            blood_type,
            quantity_requested,
            quantity_fulfilled
          )
        `
        )
        .in("urgency", ["Urgent", "Emergency"])
        .in("status", ["Pending", "Partially Fulfilled"])
        .order("request_datetime", { ascending: false })
        .limit(5);

      if (error) throw error;
      setIsLoading(false);
      return (data || [])
        .flatMap((request: any) =>
          (request.blood_request_items || []).map((item: any) => ({
            hospital: request.hospitals?.hospital_name || "Unknown Hospital",
            bloodType: item.blood_type,
            unitsNeeded:
              item.quantity_requested - (item.quantity_fulfilled || 0),
            status: request.urgency === "Emergency" ? "critical" : "low",
            urgency: request.urgency,
          }))
        )
        .filter((alert: any) => alert.unitsNeeded > 0)
        .slice(0, 5);
    },
  });

  const exportToCSV = () => {
    const timestamp = new Date().toISOString().split("T")[0];

    let csvContent = "AlayDugo Blood Inventory Report\n";
    csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Summary section
    csvContent += "INVENTORY SUMMARY\n";
    csvContent += `Total Units,${totalUnits}\n`;
    csvContent += `Available Units,${availableUnits}\n`;
    csvContent += `In Testing,${inTestingUnits}\n`;
    csvContent += `Expiring Soon (7 days),${expiringSoonUnits}\n\n`;

    // Blood type inventory
    csvContent += "INVENTORY BY BLOOD TYPE\n";
    csvContent += "Blood Type,Total,Available,In Testing,Expiring Soon,Trend\n";
    inventoryData.forEach((item) => {
      csvContent += `${item.bloodType},${item.total},${item.available},${item.inTesting},${item.expiringSoon},${item.trend}\n`;
    });

    // Low stock alerts
    csvContent += "\nLOW STOCK ALERTS (URGENT REQUESTS)\n";
    csvContent += "Hospital,Blood Type,Units Needed,Status\n";
    lowStockAlerts.forEach((item: any) => {
      csvContent += `${item.hospital},${item.bloodType},${item.unitsNeeded},${item.status}\n`;
    });

    // Recent transfers
    csvContent += "\nRECENT TRANSFERS\n";
    csvContent += "From Center,To Center,Blood Type,Units,Date\n";
    recentTransfers.forEach((item) => {
      csvContent += `${item.from},${item.to},${item.bloodType},${item.units},${item.date}\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `blood-inventory-report-${timestamp}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const recentTransfers = [
    {
      id: 1,
      from: "Manila Center",
      to: "Quezon City Center",
      bloodType: "A+",
      units: 15,
      date: "2025-01-23",
    },
    {
      id: 2,
      from: "Cebu Center",
      to: "Mandaue Center",
      bloodType: "O+",
      units: 20,
      date: "2025-01-23",
    },
    {
      id: 3,
      from: "Davao Center",
      to: "General Santos Center",
      bloodType: "B+",
      units: 10,
      date: "2025-01-22",
    },
  ];

  return {
    isRecordDialogOpen,
    setIsRecordDialogOpen,
    inventoryData,
    exportToCSV,
    lowStockAlerts,
    recentTransfers,
    isLoading,
    totalUnits,
    availableUnits,
    inTestingUnits,
    expiringSoonUnits,
  };
};
