import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ query, setQuery }) => {
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products?search=${query}`);
        setProducts(res.data.products);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchProducts();
      } else {
        setProducts([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    setQuery("");
    setShowDropdown(false);
  };

  const highlightMatch = (text) => {
    const parts = text.split(new RegExp((`${query}`), "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-red-500 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-[#F0F0F0] rounded-full px-3 py-2 w-full">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500 text-base" />
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="bg-transparent outline-none pl-2 text-[15px] w-[500px]"
        />
      </div>

      {showDropdown && (
        <div className="absolute bg-white shadow-md rounded mt-2 w-full z-50 max-h-[300px] overflow-y-auto">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-2 border-b hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => handleProductClick(product._id)}
              >
                <div className="flex flex-col">
                  <div className="font-medium text-sm">{highlightMatch(product.title)}</div>
                  {product.category && (
                    <div className="text-xs text-gray-500">Category: {product.category?.name}</div>
                  )}
                  <div className="text-sm text-green-600 font-semibold">{product.price} PKR</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;  