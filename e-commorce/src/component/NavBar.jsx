import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccountMenu from "../component/AccountMenu"; 
import {
  faBars,
  faMagnifyingGlass,
  faCartShopping,
  faUser ,
} from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "../../src/store/AuthStore";
import useCartStore from "../store/CartStore"; 
import AuthModal from "../Auth/AuthModel";
import SearchBar from "./SearchBar";
import HeaderBanner from "./HeaderBanner";

const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState(""); 
  const { name, token, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems); 
  const uniqueCartCount = cartItems.length;

  const toggleAuthModal = () => setShowAuthModal(!showAuthModal);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
    
      <nav className="fixed top-8 left-0 w-full z-50 bg-white shadow-md px-4 py-3">
        <HeaderBanner/>
        <div className="max-w-7xl mx-auto flex items-center justify-between"> 
          {/* Left: Logo & Hamburger */}
          <div className="flex items-center gap-3">
            <button
              className="block lg:hidden text-gray-700"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={faBars} className="text-2xl" />
            </button>
            <h1 className="font-extrabold text-2xl sm:text-3xl">
              <Link to="/">SHOP.CO</Link>
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-6 whitespace-nowrap  mx-auto">
            <Link to="/" className="flex items-center gap-1 font-medium">Shop</Link>
            <Link to="/" className="flex items-center gap-1 font-medium">On Sale</Link>
            <Link to="/new-arrivals" className="font-medium">New Arrival</Link>
            <Link to="/all-products" className="font-medium">Top Selling</Link>
            <Link to="/brands" className="font-medium">Brands</Link>
          </div>

          {/* Right: Search Bar and Icons */}
          <div className="flex items-center gap-4 relative ml-auto">
            {/* Search Bar for Medium and Large Screens */}
            <div className="hidden lg:flex items-center bg-gray-100 border border-gray-300 rounded-full px-3 py-2 shadow-md">
              <SearchBar query={query} setQuery={setQuery} />
            </div>

            {/* Cart icon with count */}
            <Link to="/cart" className="relative">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-2xl text-gray-700"
              />
              {uniqueCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {uniqueCartCount}
                </span>
              )}
            </Link>

            {/* User/Login */}
            {token ? (
              <AccountMenu name={name} handleLogout={handleLogout} />
            ) : (
              <button onClick={toggleAuthModal} aria-label="User  account">
                <FontAwesomeIcon
                  icon={faUser }
                  className="text-2xl text-gray-700"
                />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="lg:hidden mt-2 px-4 flex flex-col gap-2 bg-white shadow-md pb-4">
            {/* Search Bar inside the mobile menu */}
            <SearchBar query={query} setQuery={setQuery} />
            <Link to="/" className="font-medium">SHOP</Link>
            <Link to="/new-arrivals" className="font-medium">New Arrival</Link>
            <Link to="/top-selling" className="font-medium">Top Selling</Link>
            <Link to="/brands" className="font-medium">Brands</Link>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onClose={toggleAuthModal} />
    </>
  );
};

export default Navbar;
