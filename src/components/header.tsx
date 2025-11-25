import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Droplets, LogOut, UserCircle, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/pages/auth/auth.context";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<{
    first_name: string;
    last_name: string;
    email: string;
  } | null>(null);

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src='/prc-logo.png' alt='PRC Logo' className='h-8 w-8'/>
          <span className="text-xl font-bold pb-1 italic">Alay<span className="not-italic text-emergency">Dugo</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            asChild
            className={`${
              isActive("/") ? "bg-primary text-white hover:bg-none" : ""
            }`}
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className={`${
              isActive("/donors") ? "bg-primary text-white hover:bg-none" : ""
            }`}
          >
            <Link to="/donors">Donors</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className={`${
              isActive("/inventory")
                ? "bg-primary text-white hover:bg-none"
                : ""
            }`}
          >
            <Link to="/inventory">Inventory</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className={`${
              isActive("/requests") ? "bg-primary text-white hover:bg-none" : ""
            }`}
          >
            <Link to="/requests">Requests</Link>
          </Button>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src=""
                      alt={userProfile?.first_name || "User"}
                    />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile
                        ? `${userProfile.first_name} ${userProfile.last_name}`
                        : "Loading..."}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile?.email || session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" asChild>
              <Link to="/donor-login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
