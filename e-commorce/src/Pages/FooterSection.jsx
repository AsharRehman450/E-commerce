import React, { useState } from "react";
import { Mail, Twitter, Facebook, Instagram, Github } from "lucide-react";

const FooterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <div className="relative">
      {/* Newsletter Section */}
      <div className="bg-black py-8 px-4 relative z-10 rounded-2xl mx-4 lg:mx-8 transform translate-y-18">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white">
                STAY UPTO DATE ABOUT
                <br />
                OUR LATEST OFFERS
              </h2>
            </div>
            <div className="w-full lg:w-auto lg:min-w-[400px]">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  className="w-full py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  Subscribe to Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-200 text-black-900 pt-16 pb-8">
        <div className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Large Screen: 5-column layout */}
            <div className="hidden lg:grid grid-cols-5 gap-8">
              <div className="col-span-1">
                <h3 className="text-4xl font-extrabold mb-4 text-black">
                  SHOP.CO
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We have clothes that suits your style and which you're proud
                  to wear. From women to men.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://twitter.com" // Replace with your Twitter profile
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://facebook.com" // Replace with your Facebook profile
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com" // Replace with your Instagram profile
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com" // Replace with your GitHub profile
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* COMPANY */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-black">
                  COMPANY
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Career
                    </a>
                  </li>
                </ul>
              </div>

              {/* HELP */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-black">HELP</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Customer Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Delivery Details
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* FAQ */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-black">FAQ</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Account
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Manage Deliveries
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Orders
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Payments
                    </a>
                  </li>
                </ul>
              </div>

              {/* RESOURCES */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-black">
                  RESOURCES
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Free eBooks
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Development Tutorial
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      How to - Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Youtube Playlist
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Small & Medium Screens: 2x2 grid */}
            <div className="grid lg:hidden grid-cols-2 gap-8 mt-10">
              {/* COMPANY */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-black">
                  COMPANY
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Career
                    </a>
                  </li>
                </ul>
              </div>

              {/* HELP */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-black">HELP</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Customer Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Delivery Details
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* FAQ */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-black">FAQ</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Account
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Manage Deliveries
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Orders
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Payments
                    </a>
                  </li>
                </ul>
              </div>

              {/* RESOURCES */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-black">
                  RESOURCES
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Free eBooks
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Development Tutorial
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      How to - Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-black">
                      Youtube Playlist
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              Shop.co © 2000-2023, All Rights Reserved
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-black transition group">
                <span className="text-blue-600 font-bold text-xs group-hover:text-white">
                  VISA
                </span>
              </div>
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-black transition group">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full group-hover:bg-white"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full group-hover:bg-white"></div>
                </div>
              </div>
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-black transition group">
                <span className="text-blue-600 font-bold text-xs group-hover:text-white">
                  PayPal
                </span>
              </div>
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-black transition group">
                <div className="w-4 h-3 bg-black rounded-sm group-hover:bg-white"></div>
              </div>
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-black transition group">
                <span className="text-green-600 font-bold text-xs group-hover:text-white">
                  G Pay
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterSection;
