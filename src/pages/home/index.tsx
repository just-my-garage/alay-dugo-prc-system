import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import useHome from "./home.hook";
import Loading from "@/components/loading";

import heroImage1 from "./assets/1.jpg";
import heroImage2 from "./assets/2.jpeg";
import heroImage3 from "./assets/3.jpg";
import { useAuth } from "../auth/auth.context";

const Home = () => {
  const { session, userProfile } = useAuth();
  const {
    activeDonorsCount,
    totalUnits,
    emergencyRequests,
    inventoryStatus,
    donationDrives,
    fulfillmentRate,
    isLoading,
  } = useHome();

  if (isLoading) {
    return <Loading component={false} />;
  }

  return (
    <>
      {!session ? (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Carousel
              opts={{
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3500,
                }),
              ]}
              className="w-full h-full"
            >
              <CarouselContent className="h-full">
                {[heroImage1, heroImage2, heroImage3].map((image, index) => (
                  <CarouselItem key={index - 1}>
                    <div
                      className="h-[800px] w-full"
                      style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
          </div>

          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="max-w-2xl">
              <Badge variant="emergency" className="mb-4">
                Philippine Red Cross
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-blue-950 tracking-tight">
                AlayDugo Blood Bank Management System
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                A comprehensive platform for managing blood donations,
                inventory, and emergency requests across the Philippine Red
                Cross network.
              </p>

              <Button size="lg" variant="default" asChild>
                <Link to="/donor-register">Register as Donor</Link>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Carousel
              opts={{
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3500,
                }),
              ]}
              className="w-full h-full"
            >
              <CarouselContent className="h-full">
                {[heroImage1, heroImage2, heroImage3].map((image, index) => (
                  <CarouselItem key={index - 1}>
                    <div
                      className="h-[400px] w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${image})`,
                      }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
          </div>

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-2xl">
              <Badge variant="emergency" className="mb-4">
                Philippine Red Cross
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-950 tracking-tight">
                Welcome to AlayDugo
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* DASHBOARD */}
      <Dashboard
        activeDonorsCount={activeDonorsCount}
        totalUnits={totalUnits}
        emergencyRequests={emergencyRequests}
        inventoryStatus={inventoryStatus}
        donationDrives={donationDrives}
        fulfillmentRate={fulfillmentRate}
        session={session}
        userProfile={userProfile}
      />

      {/* CTA Section */}
      {!session && (
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
                <Link to="/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
