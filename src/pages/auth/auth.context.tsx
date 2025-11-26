import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext(undefined);

export const AuthContextProvider = ({ children }: React.PropsWithChildren) => {
  const [session, setSession] = useState(undefined);
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    is_admin: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //-------------------- Sign up -------------------------p
  const signUpNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

    //-------------- Sign in with Google --------------------p
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: ``,
      },
    });
  };


  // ------------------ Sign in -------------------------
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error("Sign-in error:", error.message); // Log the error for debugging
        return { success: false, error: error.message }; // Return the error
      }

      // If no error, return success
      return { success: true, data }; // Return the user data
    } catch (error) {
      // Handle unexpected issues
      console.error("Unexpected error during sign-in:", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    const fetchUserProfile = async (email: string) => {
      const { data } = await supabase
        .from("users")
        .select("first_name, last_name, email, is_admin")
        .eq("email", email)
        .single();
      
      if (data) {
        setUserProfile(data);
      }
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        fetchUserProfile(session.user.email);
      } else {
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user?.email) {
          fetchUserProfile(session.user.email);
        } else {
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      return { success: false, error };
    } else {
      window.location.href = "/";
    }
  }

  return (
    <AuthContext.Provider
      value={{ signInWithGoogle, signUpNewUser, signInUser, session, signOut, userProfile, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
