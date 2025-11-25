import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const useDonorPage = () => {
  // CONTAINING ALL CRUD OPERATIONS FOR DONOR PAGE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const itemsPerPage = 10;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 1000); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const fetch = useQuery({
    queryKey: ["user-donors", debouncedSearch, currentPage],
    queryFn: async () => {
      setIsLoading(true);
      
      // First, get the total count
      let countQuery = supabase.from("users").select("*", { count: "exact", head: true });
      if (debouncedSearch.trim()) {
        countQuery = countQuery.or(
          `first_name.ilike.%${debouncedSearch}%,` +
          `last_name.ilike.%${debouncedSearch}%,` +
          `contact_number.ilike.%${debouncedSearch}%,` +
          `blood_type.ilike.%${debouncedSearch}%`
        );
      }
      const { count } = await countQuery;
      if (count !== null) setTotalCount(count);

      // Then get the paginated data
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      let query = supabase.from("users").select("*").range(from, to);

      // Apply search filter if search query exists
      if (debouncedSearch.trim()) {
        query = query.or(
          `first_name.ilike.%${debouncedSearch}%,` +
          `last_name.ilike.%${debouncedSearch}%,` +
          `contact_number.ilike.%${debouncedSearch}%,` +
          `blood_type.ilike.%${debouncedSearch}%`
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
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    handleNextPage,
    handlePreviousPage,
    handlePageClick,
  };
};

export default useDonorPage;
