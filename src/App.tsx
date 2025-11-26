import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./pages/auth/auth.context";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home/index";
import Donors from "./pages/donor/index";
import DonorLogin from "./pages/auth/login";
import DonorRegister from "./pages/auth/register";
import Inventory from "./pages/inventory/index";
import Requests from "./pages/blood-requests/index";
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
            {/* Public routes - accessible to everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/donor-login" element={<DonorLogin />} />
            <Route path="/donor-register" element={<DonorRegister />} />
            <Route path="/learn-more" element={<LearnMore/>}/>
            <Route path="*" element={<NotFound />} />
            
            {/* Auth required routes - accessible to authenticated users */}
            <Route 
              path="/requests" 
              element={
                <ProtectedRoute requireAuth>
                  <Requests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAuth>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute requireAuth>
                  <Account />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin only routes - accessible only to admin users */}
            <Route 
              path="/donors" 
              element={
                <ProtectedRoute requireAdmin>
                  <Donors />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute requireAdmin>
                  <Inventory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule-drive" 
              element={
                <ProtectedRoute requireAdmin>
                  <ScheduleDrive />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/drive/:driveId" 
              element={
                <ProtectedRoute requireAdmin>
                  <DriveDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-request" 
              element={
                <ProtectedRoute requireAdmin>
                  <CreateRequest />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthContextProvider>
  </QueryClientProvider>
);

export default App;
