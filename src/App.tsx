import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./pages/auth/auth.context";
import Home from "./pages/home";
import Donors from "./pages/donor";
import DonorLogin from "./pages/auth/login";
import DonorRegister from "./pages/auth/register";
import Inventory from "./pages/inventory";
import Requests from "./pages/blood-requests";
import CreateRequest from "./pages/blood-requests/components/CreateRequest";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import ScheduleDrive from "./pages/home/components/ScheduleDrive";
import DriveDetails from "./pages/home/components/DriveDetails";
import NotFound from "./pages/NotFound";
import LearnMore from "./pages/LearnMore";
import Layout from "./pages/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
    <TooltipProvider>
      <Toaster /> 
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/donor-login" element={<DonorLogin />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/donor-register" element={<DonorRegister />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/schedule-drive" element={<ScheduleDrive />} />
            <Route path="/learn-more" element={<LearnMore/>}/>
            <Route path="/drive/:driveId" element={<DriveDetails />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthContextProvider>
  </QueryClientProvider>
);

export default App;
