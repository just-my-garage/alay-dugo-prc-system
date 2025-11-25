import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Droplets,
  UserPlus,
  Search,
  Phone,
  Calendar,
  Trash2,
  Mail,
  MapPin,
  Cake,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import useDonorPage from "./donor.hook";
import NewDonorComponent from "./components/new-donor";
import Loading from "@/components/loading";

const Donors = () => {
  const { 
    fetch, 
    isLoading, 
    handleDelete, 
    searchQuery, 
    setSearchQuery,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    handleNextPage,
    handlePreviousPage,
    handlePageClick,
  } = useDonorPage();
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <>
      <div className="container mx-auto px-4 py-8 mb-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Donor Management
            </h1>
            <p className="text-muted-foreground">
              Register and manage blood donors
            </p>
          </div>
          <Button
            variant="default"
            size="lg"
            onClick={() => setShowRegistration(!showRegistration)}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Register New Donor
          </Button>
        </div>

        {/* Registration Form */}
        {showRegistration && (
          <NewDonorComponent setShowRegistration={setShowRegistration} />
        )}

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search donors by name, phone, or blood type..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Donors List */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Donors</CardTitle>
            <CardDescription>
              Recent donor registrations and their eligibility status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading component={true} />
            ) : (
              <div className="lg:grid grid-cols-2 gap-4">
                {fetch.data?.map((donor: any) => {
                  const formatDate = (dateString: string) => {
                    if (!dateString) return "N/A";
                    return new Date(dateString).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  };

                  const getEligibilityColor = (status: string) => {
                    if (status === "Eligible") return "success";
                    if (status === "Ineligible") return "destructive";
                    return "secondary";
                  };

                  return (
                    <div
                      key={donor.donor_id}
                      className="p-6 border rounded-xl hover:shadow-lg transition-all duration-200 bg-card"
                    >
                      <div className="flex items-start justify-between gap-6">
                        {/* Left Section - Main Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-4 bg-primary/10 rounded-xl">
                            <Droplets className="h-8 w-8 text-primary" />
                          </div>
                          <div className="space-y-3 flex-1">
                            {/* Name and Blood Type */}
                            <div>
                              <div className="font-bold text-xl text-foreground mb-2">
                                {donor.first_name} {donor.last_name}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="default" className="text-sm font-semibold">
                                  {donor.blood_type}
                                </Badge>
                                <Badge variant={getEligibilityColor(donor.eligibility_status)}>
                                  {donor.eligibility_status || "Pending"}
                                </Badge>
                              </div>
                            </div>

                            {/* Contact Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{donor.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span>{donor.contact_number}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">
                                  {donor.address}, {donor.city}, {donor.province}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Cake className="h-4 w-4 flex-shrink-0" />
                                <span>Born: {formatDate(donor.date_of_birth)}</span>
                              </div>
                            </div>

                            {/* Donation History */}
                            <div className="pt-2 border-t">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Last Donation:{" "}
                                  <span className="font-medium text-foreground">
                                    {donor.last_donation_date
                                      ? formatDate(donor.last_donation_date)
                                      : "No record"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(donor.donor_id)}
                            disabled={isLoading}
                            className="h-10 w-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {!isLoading && fetch.data && fetch.data.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} donors
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageClick(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Donors;
