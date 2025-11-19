import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../auth/auth.context";
import { useState, useEffect } from "react";

const useHome = () => {
  const { session, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    last_name: string;
    email: string;
  } | null>(null);

  const authenticated = () => {
    console.log(session);
  };

  const getInitials = () => {
    if (!userProfile) return "U";
    return `${userProfile.first_name?.[0] || ""}${
      userProfile.last_name?.[0] || ""
    }`.toUpperCase();
  };

  useEffect(() => {
    if (session?.user.email) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from("users")
          .select("first_name, last_name, email")
          .eq("email", session.user.email)
          .single();

        if (data) {
          setUserProfile(data);
        }
      };
      fetchProfile();
    }
  }, [session]);

  return {
    userProfile,
    authenticated,
    getInitials,
    session,
    signOut,
  };
};

export default useHome;
