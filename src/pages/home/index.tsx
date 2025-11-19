import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Heart, Clock, MapPin } from "lucide-react";
import heroImage from "./assets/hero-blood-donation.jpg";
import { Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import useHome from "./home.hook";

const Home = () => {
  const { isAuthenticated, session } = useHome();

  const authenticated = () => {
    console.log(session)
  }
  

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
            <Button variant="ghost" asChild onClick={authenticated}>
              <p>Home</p>
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
            <Button variant="default" asChild>
              <Link to="/donor-login">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
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
              A comprehensive platform for managing blood donations, inventory,
              and emergency requests across the Philippine Red Cross network.
            </p>

            <Button size="lg" variant="default" asChild>
              <Link to="/donor-register">Register as Donor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <Dashboard />

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Save Lives Through Blood Donation
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Every donation counts. Join our network of donors and help ensure
            blood availability for those in need across the Philippines.
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
              <h3 className="font-semibold mb-4 text-foreground">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Find PRC Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Donation Drives
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">For Donors</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Register
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Eligibility
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Donation History
                  </a>
                </li>
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
            <p>
              &copy; 2025 AlayDugo - Philippine Red Cross. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
