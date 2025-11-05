import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import FooterSection from "./FooterSection";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const fetchProducts = async () => {
  const res = await axios.get("http://localhost:5000/api/products", {
    params: {
      page: 1,
      limit: 100,
      sort: "createdAt",
      order: "desc",
    },
  });
  return res.data.products;
};

const AllProducts = () => {
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-products"],
    queryFn: fetchProducts,
    staleTime:60000,
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) {
    toast.error("Failed to load new arrivals.", { autoClose: 2000 });
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load new arrivals.
      </p>
    );
  }

  return (
    <>
      <div className="px-4 py-8 mt-[100px]">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center pb-8">
          ALL PRODUCTS
        </h1>

        {/* Product Grid */}
        <div className="flex flex-wrap justify-center gap-10">
          {products.map((product) => {
            const discountedPrice =
              product.discount > 0
                ? Math.round(
                    product.price - (product.price * product.discount) / 100
                  )
                : product.price;

            return (
              <Link to={`/product/${product._id}`} key={product._id}>
                <div className="text-center max-w-[200px] hover:scale-105 transition-transform duration-300">
                  <img
                    src={
                      Array.isArray(product.photo)
                        ? product.photo[0]
                        : product.photo || "/placeholder.jpg"
                    }
                    alt={product.name}
                    className="mb-2 w-full h-[250px] object-cover rounded-lg shadow-md"
                  />
                  <p className="font-semibold mt-2">{product.title}</p>

                  {/* Rating */}
                  <div className="flex justify-center items-center gap-1">
                    {Array.from({
                      length: Math.round(parseFloat(product.rating)),
                    }).map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-600">
                      ({product.rating})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-black">
                      $
                      {product.discount > 0
                        ? Math.round(
                            product.price -
                              (product.price * product.discount) / 100
                          )
                        : product.price}
                    </span>

                    {product.discount > 0 && (
                      <>
                        <span className="line-through text-gray-400 text-xs">
                          ${product.price}
                        </span>
                        <span className="text-[10px] text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                          -{product.discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/")}
            className="h-12 w-48 border-2 border-black rounded-full hover:bg-black hover:text-white transition duration-300"
          >
            BACK TO HOME
          </button>
        </div>
      </div>
      <FooterSection />
    </>
  );
};

export default AllProducts;
