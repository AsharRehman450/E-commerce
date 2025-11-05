import React from "react";
import Marquee from "react-fast-marquee";

const BrandFooter = () => {
  const baseBrands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];
  const repeatCount = 2;
  const brands = Array(repeatCount).fill(baseBrands).flat();

  return (
    <footer className="bg-black py-8 px-6 sm:px-12 lg:px-20">
      <Marquee speed={60} gradient={false}>
        <div className="flex items-center text-white text-[22px] sm:text-[28px] leading-snug">
          {brands.map((brand, index) => (
            <span
              key={index}
              className={`font-medium whitespace-nowrap mx-[30px] ${
                brand === "VERSACE"
                  ? "font-versace"
                  : brand === "ZARA"
                  ? "font-zara"
                  : brand === "GUCCI"
                  ? "font-gucci"
                  : brand === "PRADA"
                  ? "font-prada font-bold"
                  : brand === "Calvin Klein"
                  ? "font-calvin-klein"
                  : ""
              }`}
            >
              {brand}
            </span>
          ))}
        </div>
      </Marquee>
    </footer>
  );
};

export default BrandFooter;
