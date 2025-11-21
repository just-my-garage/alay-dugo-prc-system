import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const useDonorPage = () => {
  // CONTAINING ALL CRUD OPERATIONS FOR DONOR PAGE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetch = useQuery({
    queryKey: ["user-donors", debouncedSearch],
    queryFn: async () => {
      setIsLoading(true);
      let query = supabase.from("users").select("*");

      // Apply search filter if search query exists
      if (searchQuery.trim()) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%,` +
          `last_name.ilike.%${searchQuery}%,` +
          `contact_number.ilike.%${searchQuery}%,` +
          `blood_type.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
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
    searchQuery,
    setSearchQuery,
  };
};

export default useDonorPage;
