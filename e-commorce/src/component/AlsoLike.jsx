import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const fetchAlsoLike = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/products?category=Casual"
  );
  return response.data.products.slice(3, 7);
};

const AlsoLike = () => {
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["also-like"],
    queryFn: fetchAlsoLike,
    staleTime:3 * 60 * 1000,
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  if (isError) {
    toast.error("Failed to load also like products.", { autoClose: 2000 });
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load also like products.
      </p>
    );
  }

  return (
    <div className="px-4 ">
      <h1 className="text-5xl font-black text-center pb-12 text-black tracking-tight">
        YOU MIGHT ALSO LIKE
      </h1>

      <div className="flex flex-wrap justify-center gap-5">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="text-left w-[295px] hover:scale-105 transition-transform duration-300">
              {/* Image Container */}
              <div className="w-full h-[298px] mb-4 overflow-hidden rounded-[20px] bg-gray-100">
                <img
                  src={product.photo?.[0] || "/placeholder.jpg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Title */}
              <h3 className="font-bold text-xl text-black mb-2 leading-tight">
                {product.title}
              </h3>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.round(parseFloat(product.rating))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-black ml-1 font-medium">
                  {product.rating}/5
                </span>
              </div>

              {/* Price Section */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-black">
                  $
                  {product.discount > 0
                    ? Math.round(
                        product.price - (product.price * product.discount) / 100
                      )
                    : product.price}
                </span>

                {product.discount > 0 && (
                  <>
                    <span className="text-2xl font-bold text-gray-400 line-through">
                      ${product.price}
                    </span>
                    <span className="text-xs font-medium text-red-500 bg-red-100 px-2 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  </>
                )}
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

export default AlsoLike;
