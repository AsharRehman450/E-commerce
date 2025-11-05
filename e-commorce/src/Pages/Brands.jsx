
import React from "react";
import { useNavigate } from "react-router-dom";

function Brands() {
  const navigate = useNavigate();

 const GoFirst = () => {
  navigate("/casual");
};

const GoFormal = () => {
   navigate("/formal");
}

const GoParty = ()=>{
   navigate("/party");
}

const GoGym = () =>{
  navigate("/gym")
}

  return (
    <div className="px-4">
  <div className="w-full mt-8 bg-[#F0F0F0] rounded-2xl pt-3">
    <h1 className="text-center text-5xl font-bold mb-8 mt-5">
      BROWSE BY DRESS STYLE
    </h1>

    {/* First Row */}
    <section className="flex flex-col md:flex-row gap-4 mb-6 px-4">
      <div className="relative w-full md:w-[40%]">
        <img
          className="h-60 w-full object-cover rounded-xl transition duration-300 hover:scale-105"
          src="first.png"
          alt="Casual"
          onClick={() => GoFirst()}
        />
        <h1 className="absolute top-4 left-4 text-2xl font-bold bg-opacity-50 px-3 py-1 rounded">
          Casual
        </h1>
      </div>

      <div className="relative w-full md:w-[60%]">
        <img
          className="h-60 w-full object-cover rounded-xl transition duration-300 hover:scale-105"
          src="second.png"
          alt="Formal"
          onClick={()=> GoFormal()}
        />
        <h1 className="absolute top-4 left-4 text-2xl font-bold bg-opacity-50 px-3 py-1 rounded">
          Formal
        </h1>
      </div>
    </section>

    {/* Second Row */}
    <section className="flex flex-col md:flex-row gap-4 px-4">
      <div className="relative w-full md:w-[60%]">
        <img
          className="h-60 w-full object-cover rounded-xl transition duration-300 hover:scale-105"
          src="third.png"
          alt="Party"
          onClick={()=> GoParty()}
        />
        <h1 className="absolute top-4 left-4 text-2xl font-bold bg-opacity-50 px-3 py-1 rounded">
          Party
        </h1>
      </div>

      <div className="relative w-full md:w-[40%]">
        <img
          className="h-60 w-full object-cover rounded-xl transition duration-300 hover:scale-105"
          src="four.png"
          alt="Gym"
          onClick={()=> GoGym()}
        />
        <h1 className="absolute top-4 left-4 text-2xl font-bold bg-opacity-50 px-3 py-1 rounded">
          Gym
        </h1>
      </div>
    </section>
  </div>
</div>

  );
}

export default Brands;
