import React, { useState } from "react";
import AuthModal from "../Auth/AuthModel";

const HeaderBanner = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true); 
    setAuthOpen(true);   
  };

  return (
    <>
    <div className="fixed top-0 left-0 w-full h-8 bg-black text-white text-center text-sm sm:text-base flex items-center justify-center z-50">
     Signup and get 20% off for your first order. <u onClick={handleSignupClick} className="ml-1 cursor-pointer">Signup Now</u>
   </div>
      
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultToSignup={showSignup}
      />
    </>
  );
};

export default HeaderBanner;
