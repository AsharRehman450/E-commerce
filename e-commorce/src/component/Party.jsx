import axios from "axios";
import { Link } from "react-router-dom";
import FooterSection from "./FooterSection";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const fetchPartyProducts = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/products?category=Party"
  );
  return res.data.products;
};

const Party = () => {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["party"],
    queryFn: fetchPartyProducts,
    staleTime: 3 * 60 * 1000,
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) {
    toast.error("Failed to load party products.", { autoClose: 2000 });
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load Party products
      </p>
    );
  }

  return (
    <>
      <div className="px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 mt-8">Party</h1>

        <div className="flex flex-wrap justify-center gap-10">
          {products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id}>
              <div className="text-center w-[200px] hover:scale-105 transition-transform duration-300">
                <img
                  src={product.photo?.[0] || "/placeholder.jpg"}
                  alt={product.title}
                  className="mb-2 w-full h-[250px] object-cover rounded-lg shadow-md"
                />

                <p className="font-semibold text-left mt-2">{product.title}</p>

                <div className="flex justify-start items-center gap-1">
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
          ))}
        </div>
      </div>
      <FooterSection />
    </>
  );
};

export default Party;
