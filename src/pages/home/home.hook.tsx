import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../auth/auth.context";

const useHome = () => {
  const { session } = useAuth();

   const isAuthenticated = !!session?.user;

  const checkAuthentication = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    return !!currentSession;
  }

  return {
    isAuthenticated,
    session
  }
}

export default useHome