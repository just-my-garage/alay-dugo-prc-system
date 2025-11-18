import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

const useDonorPage = () => {
  // CONTAINING ALL CRUD OPERATIONS FOR DONOR PAGE
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetch = useQuery({
    queryKey: ["user-donors"],
    queryFn: async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      if (data) { 
        setIsLoading(false);
        console.log(data)
        return data;
      }
    },
  });

  const deleteMethod = useMutation({
    mutationKey: ["delete-donor"],
    mutationFn: async (donor_id: number) => {
      setIsLoading(true);
      const { error } = await supabase.from("users").delete().eq("donor_id", donor_id);
      if (error) throw error;
    },
  });

  const handleDelete = async (donorId: number) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        await deleteMethod.mutateAsync(donorId);
        fetch.refetch();
      } catch (error) {
        console.error("Failed to delete donor:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    isLoading,
    setIsLoading,
    fetch,
    handleDelete,
  };
};

export default useDonorPage;
