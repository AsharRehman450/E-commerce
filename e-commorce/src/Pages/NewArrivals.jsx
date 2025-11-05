import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

        const fetchNewArrivals = async () => {
        const response = await axios.get("http://localhost:5000/api/products/new-arrivals");
        return response.data.products
        }

        const NewArrivals = () => {
        const navigate = useNavigate();

        const {data: products = [], isLoading ,isError } = useQuery({
          queryKey: ["new-arrivals"],
          queryFn:   fetchNewArrivals,
          staleTime:30000,
          // refetchInterval:1000,
          // refetchIntervalInBackground:true,
        })
        
         if (isLoading) return <p className="text-center py-10">Loading...</p>;
         if (isError) {
         toast.error("Failed to load new arrivals.", { autoClose: 2000 });
         return <p className="text-center py-10 text-red-500">Failed to load new arrivals.</p>;
         }

  return (
    <div className="px-4 py-8 mt-[10px]">
      <h1 className="text-4xl md:text-6xl  font-integral font-extrabold text-center pb-8">
        NEW ARRIVALS
      </h1>

      <div className="flex flex-wrap justify-center gap-10">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="text-center max-w-[200px] hover:scale-105 transition-transform duration-300">
              <img
                src={product.photo?.[0] || "/placeholder.jpg"}
                alt={product.title}
                className="mb-2 w-full object-cover rounded-lg shadow-md"
              />
              
              {/* Use a flex container for title, rating, and price */}
              <div className="flex flex-col items-start text-left">
                <p className="font-semibold mt-2">{product.title}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.round(parseFloat(product.rating)) }).map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </div>

                {/* Price section on the left */}
                <div className="flex items-center gap-3 text-left mt-1">
                  <span className="text-lg font-bold text-black">
                    ${product.discount > 0
                      ? Math.round(product.price - (product.price * product.discount) / 100)
                      : product.price}
                  </span>

                  {product.discount > 0 && (
                    <>
                      <span className="line-through text-gray-400 text-sm">
                        ${product.price}
                      </span>
                      <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate("/all-products")}
          className="mt-10 h-12 w-48 border-2 border-gray-300 rounded-full text-black hover:bg-black hover:text-white transition duration-300"
        >
          VIEW ALL
        </button>
      </div>
    </div>
  );
};

export default NewArrivals;
