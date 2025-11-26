import {
  Clock,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src='/prc-logo.png' alt='PRC Logo' className='h-8 w-8' />
              <span className="font-bold text-foreground">AlayDugo</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Philippine Red Cross Blood Bank Management System
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
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
  );
};

export default Footer;
