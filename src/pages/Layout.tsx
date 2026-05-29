import Header from "@/components/header";
import Footer from "@/components/footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full px-2 sm:px-6 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
