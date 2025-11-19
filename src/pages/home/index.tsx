import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import heroImage from "./assets/hero-blood-donation.jpg";
import Header from "@/components/header";
import Footer from "@/components/footer";

import { Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import useHome from "./home.hook";

const Home = () => {
  const { userProfile, authenticated, getInitials, session, signOut } =
    useHome();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Header />

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
      <Footer />
    </div>
  );
};

export default Home;
