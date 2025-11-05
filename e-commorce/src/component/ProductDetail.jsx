import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useCartStore from "../store/CartStore";
import ProductTabs from "./ProductTabs";
import AlsoLike from "./AlsoLike";
import FooterSection from "./FooterSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";

const fetchProduct = async (id) => {
  const res = await axios.get(`http://localhost:5000/api/product/${id}`);
  return res.data.product;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      setMainImage(product.photo?.[0]);
    }
  }, [product]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load product details. Please try again.", {
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  }, [isError]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select both color and size before adding to cart.", {
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    addToCart({
      id: product._id,
      title: product.title,
      price: discountedPrice,
      originalPrice: product.price,
      discount: product.discount,
      image: product.photo?.[0],
      color: selectedColor,
      size: selectedSize,
      quantity,
    });

    toast.success("Item added to cart successfully!", {
      autoClose: 2000,
      pauseOnHover: false,
    });
  };

  if (isLoading || !product)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  const discountedPrice =
    product.discount > 0
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : product.price;
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mt-[100px]">
        {/* Left Section - Images */}
        <div className="order-1 lg:order-1">
          {/* Mobile: Main Image First */}
          <div className="block sm:hidden mb-4">
            <div className="flex items-center justify-center bg-gray-100 rounded-xl p-4 aspect-square">
              {mainImage && (
                <img
                  src={mainImage}
                  alt="Main"
                  className="w-full max-h-[400px] lg:max-h-[500px] object-contain"
                />
              )}
            </div>
          </div>

          {/* Mobile: Thumbnails Row */}
          <div className="block sm:hidden mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.photo?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover border cursor-pointer flex-shrink-0 ${
                    mainImage === img ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Desktop: Side by side layout */}
          <div className="hidden sm:flex gap-4 lg:gap-6">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 lg:gap-4">
              {product.photo?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx}`}
                  className={`w-16 h-16 lg:w-20 lg:h-20 rounded-md object-cover border cursor-pointer ${
                    mainImage === img ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl p-4">
              {mainImage && (
                <img
                  src={mainImage}
                  alt="Main"
                  className="w-full max-h-[400px] lg:max-h-[500px] object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Details */}
        <div className="order-2 lg:order-2 flex flex-col justify-start gap-4 sm:gap-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-integral font-extrabold uppercase leading-tight">
            {product.title}
          </h1>
              
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400 text-base sm:text-lg">
              {Array.from({ length: Math.floor(product.rating) }).map(
                (_, i) => (
                  <span key={i}>★</span>
                )
              )}
              {parseFloat(product.rating) % 1 !== 0 && <span>½</span>}
            </div>
            <span className="text-sm text-gray-600">{product.rating}/5</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg sm:text-xl font-bold text-black">
              ${discountedPrice}
            </span>
            {product.discount > 0 && (
              <>
                <span className="line-through text-gray-400 text-xs sm:text-sm">
                  ${product.price}
                </span>
                <span className="text-[10px] sm:text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed border-t pt-4">
            {product.description ||
              "This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."}
          </p>

          {/* Colors */}
          {product.color?.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                Select Colors
              </h4>
              <div className="flex gap-2 sm:gap-3">
                {product.color.map((clr, idx) => (
                  <div
                    key={idx}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 cursor-pointer ${
                      selectedColor === clr
                        ? "ring-2 ring-black ring-offset-1"
                        : ""
                    }`}
                    style={{ backgroundColor: clr }}
                   
                    onClick={() => 
                      setSelectedColor(clr)
                     }
                    
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.size?.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                Choose Size
              </h4>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.size.map((s) => (
                  <button
                    key={s}
                    className={`px-3 py-2 sm:px-4 sm:py-2 border rounded-full text-xs sm:text-sm transition-colors ${
                      selectedSize === s
                        ? "bg-black text-white"
                        : "hover:bg-black hover:text-white"
                    }`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4">
            <div className="flex items-center justify-center border rounded-full px-4 py-2 w-full sm:w-auto">
              <button
                onClick={handleDecrease}
                className="text-lg sm:text-xl px-2 py-1"
              >
                -
              </button>
              <span className="px-3 sm:px-2 font-medium">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="text-lg sm:text-xl px-2 py-1"
              >
                +
              </button>
            </div>

            <button
              className="bg-black text-white px-6 py-2.5 sm:py-2 rounded-full hover:bg-gray-800 transition text-sm sm:text-base font-medium w-full sm:flex-1"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Tabs Section - Full Width */}
        <div className="col-span-1 lg:col-span-2 order-3 mt-6 sm:mt-8 lg:mt-12">
          <div className="w-full max-w-none lg:max-w-6xl mx-auto">
            <ProductTabs
              reviews={reviews}
              setReviews={setReviews}
              productId={product._id}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12 lg:mt-16">
        <AlsoLike />
      </div>
      <FooterSection />
    </>
  );
};

export default ProductDetail;
