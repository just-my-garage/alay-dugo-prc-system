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
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useHome from "@/pages/home/home.hook";

const Header = () => {
  const navigate = useNavigate();
  const { userProfile, authenticated, getInitials, session, signOut } =
    useHome();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">AlayDugo</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to='/'>Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/donors">Donors</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/inventory">Inventory</Link>
          </Button>
          <Button variant="ghost" asChild>
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
