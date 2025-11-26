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

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, signOut, userProfile } = useAuth();
  const [isOnRegister, setIsOnRegister] = useState<boolean>(false);

  const getInitials = () => {
    if (!userProfile) return "U";
    return `${userProfile.first_name?.[0] || ""}${
      userProfile.last_name?.[0] || ""
    }`.toUpperCase();
  };

  useEffect(() => {
    setIsOnRegister(location.pathname === "/donor-register");
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src='/prc-logo.png' alt="AlayDugo Logo" className="h-8 w-8"/>
          <h1 className="text-2xl font-bold text-blue-950 pb-1 tracking-tighter">Alay<span className="text-primary">Dugo</span></h1>
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button
                variant="ghost"
                asChild
                className={`${
                  isActive("/") ? "bg-primary text-white hover:bg-none" : ""
                }`}
              >
                <Link to="/">Dashboard</Link>
              </Button>
              {userProfile?.is_admin && (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className={`${
                      isActive("/donors")
                        ? "bg-primary text-white hover:bg-none"
                        : ""
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
                </>
              )}
              <Button
                variant="ghost"
                asChild
                className={`${
                  isActive("/requests")
                    ? "bg-primary text-white hover:bg-none"
                    : ""
                }`}
              >
                <Link to="/requests">Requests</Link>
              </Button>
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
            </>
          ) : isOnRegister ? (
            <>
              <Button
                variant="outline"
                asChild
                size="sm"
                className="md:size-default"
              >
                <Link to="/donor-login">
                  <span className="hidden sm:inline">Already registered? </span>
                  Sign In
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                asChild
                className="hover:bg-none hover:ring-blue-600"
              >
                <Link to="/donor-register">Register as Donor</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
