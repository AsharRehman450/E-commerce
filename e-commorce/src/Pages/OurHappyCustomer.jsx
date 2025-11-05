import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchPaginatedReviews } from "../../src/API/Api";

const OurHappyCustomer = () => {
  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reviews", page],
    queryFn: () => fetchPaginatedReviews(page, limit),
    keepPreviousData: true,
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading customer reviews...</div>;
  }

  if (isError) {
    toast.error("Failed to load customer reviews.");
    return (
      <div className="text-center text-red-500 py-10">
        Error occurred: {error.message}
      </div>
    );
  }

  if (!data?.reviews || data.reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">No reviews found</div>
    );
  }

  return (
    <div className="relative px-4 py-12 bg-white overflow-hidden">
      <h2 className="text-4xl font-integral font-extrabold text-center mb-10">
        OUR HAPPY CUSTOMERS
      </h2>

                          {/* Arrows */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between sm:justify-end gap-3 px-4 sm:px-10 mt-4 sm:mt-0 mb-6">

                          {/* Pagination Info */}
        <div className="text-gray-600 text-base">
          Page {data.currentPage} of {data.totalPages}
        </div>

        <ArrowLeftIcon
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`h-6 w-6 cursor-pointer transition ${
            page === 1 ? "text-gray-300" : "text-gray-800 hover:text-black"
          }`}
        />
        <ArrowRightIcon
          onClick={() =>
            setPage((prev) =>
              data.totalPages && prev < data.totalPages ? prev + 1 : prev
            )
          }
          className={`h-6 w-6 cursor-pointer transition ${
            page === data.totalPages
              ? "text-gray-300"
              : "text-gray-800 hover:text-black"
          }`}
        />
      </div>

      {/* Reviews */}
      <div className="overflow-x-hidden">
        <div className="flex flex-wrap gap-6 justify-center">
          {data.reviews.map((review) => (
            <div
              key={review._id}
              className="w-full sm:w-[30%] bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition-all"
              style={{ opacity: 0.9 }}
            >
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46 1.287 3.975c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.39 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.975-3.39-2.46c-.784-.57-.38-1.81.588-1.81h4.18l1.286-3.975z" />
                  </svg>
                ))}
              </div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">
                {review.customerName}
              </h4>
              <p className="overflow-y-auto max-h-24 scroll-hidden">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurHappyCustomer;
