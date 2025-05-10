import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Clock,
  CreditCard,
  Shield,
  Headphones
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-indigo-900 text-gray-100">
      {/* Top Section with Trust Badges */}
      <div className="container mx-auto px-4 py-8 border-b border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center">
            <Clock className="w-8 h-8 mr-3 text-blue-400" />
            <div>
              <h4 className="font-bold">24/7 Support</h4>
              <p className="text-sm text-gray-400">Round the clock assistance</p>
            </div>
          </div>
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-blue-400" />
            <div>
              <h4 className="font-bold">Secure Payments</h4>
              <p className="text-sm text-gray-400">Protected transactions</p>
            </div>
          </div>
          <div className="flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-400" />
            <div>
              <h4 className="font-bold">Best Price Guarantee</h4>
              <p className="text-sm text-gray-400">Always get the best deals</p>
            </div>
          </div>
          <div className="flex items-center">
            <Headphones className="w-8 h-8 mr-3 text-blue-400" />
            <div>
              <h4 className="font-bold">Dedicated Assistance</h4>
              <p className="text-sm text-gray-400">Expert travel advisors</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Flight Booker</h3>
            <p className="text-gray-400 mb-4">Your trusted partner for hassle-free flight bookings worldwide. Offering the best prices and exceptional customer service since 2010.</p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Search Flights</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Special Offers</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Flight Status</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Destinations</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Travel Guide</a>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Booking Guide</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Cancellation Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Contact Us</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-blue-400" />
                <span className="text-gray-400">1123 Model Town, Gurugram, 122413, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-400" />
                <span className="text-gray-400">+91-8307611216</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400" />
                <span className="text-gray-400">support@flightbooker.com</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} FlightBooker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;