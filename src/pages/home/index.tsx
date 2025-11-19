import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Droplets, 
  Heart, 
  AlertCircle, 
  Users, 
  Package, 
  TrendingUp,
  Clock,
  MapPin,
  LogOut,
  UserCircle,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import heroImage from "./assets/hero-blood-donation.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth.context";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string; email: string } | null>(null);

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

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

  const getInitials = () => {
    if (!userProfile) return "U";
    return `${userProfile.first_name?.[0] || ""}${userProfile.last_name?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AlayDugo</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
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
            {session && userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={userProfile.first_name} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userProfile.first_name} {userProfile.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userProfile.email}
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="emergency" className="mb-4">
              Philippine Red Cross
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              AlayDugo Blood Bank Management System
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A comprehensive platform for managing blood donations, inventory, and emergency requests 
              across the Philippine Red Cross network.
            </p>
            <div className="flex gap-4">
              <Button size="lg" variant="default" asChild>
                <Link to="/dashboard">Access Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/donor-register">Register as Donor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Streamline blood bank operations with our comprehensive management system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Donor Management</CardTitle>
                <CardDescription>
                  Register, screen, and maintain donor records with automatic scheduling and eligibility tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <AlertCircle className="h-12 w-12 text-emergency mb-4" />
                <CardTitle>Emergency Response</CardTitle>
                <CardDescription>
                  Prioritize urgent blood requests with real-time alerts and rapid allocation system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Package className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Inventory & Supply Chain</CardTitle>
                <CardDescription>
                  Track blood units in real-time, manage requests, and forecast demand across PRC centers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">15,420</div>
                    <div className="text-sm text-muted-foreground">Active Donors</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <Package className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">2,847</div>
                    <div className="text-sm text-muted-foreground">Units in Stock</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emergency/10 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-emergency" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">23</div>
                    <div className="text-sm text-muted-foreground">Pending Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">98.2%</div>
                    <div className="text-sm text-muted-foreground">Fulfillment Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Save Lives Through Blood Donation</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Every donation counts. Join our network of donors and help ensure blood availability 
            for those in need across the Philippines.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/donor-register">Register as Donor</Link>
            </Button>
            <Button size="lg" variant="secondary" className="text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">AlayDugo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Philippine Red Cross Blood Bank Management System
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Find PRC Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Donation Drives</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">For Donors</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Register</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Eligibility</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Donation History</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Philippine Red Cross HQ</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Emergency Hotline</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 AlayDugo - Philippine Red Cross. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
