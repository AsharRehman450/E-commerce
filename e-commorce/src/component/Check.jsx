// import React, { useState } from "react";
// import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
// import { useQuery } from "@tanstack/react-query";
// import { fetchPaginatedReviews } from "../../src/API/Api"; // path check karo

// const OurHappyCustomer = () => {
//   const [page, setPage] = useState(1);
//   const limit = 3;

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["reviews", page],
//     queryFn: () => fetchPaginatedReviews(page),
//     keepPreviousData: true,
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error occurred: {error.message}</p>;
//   if (!data?.reviews) return <p>No reviews found</p>;

//   return (
//     <div>
//       <h1>Our Happy Customers</h1>
//       {data.reviews.map((review) => (
//         <div key={review._id}>
//           <h2>{review.name}</h2>
//           <p>{review.comment}</p>
//         </div>
//       ))}

//       <div className="flex justify-center mt-4 space-x-2">
//         <ArrowLeftIcon
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//           className="h-6 w-6 cursor-pointer"
//         />
//         <span>{data.currentPage} / {data.totalPages}</span>
//         <ArrowRightIcon
//           onClick={() =>
//             setPage((prev) =>
//               prev < data.totalPages ? prev + 1 : prev
//             )
//           }
//           className="h-6 w-6 cursor-pointer"
//         />
//       </div>
//     </div>
//   );
// };

// export default OurHappyCustomer;















        //   products tab code 
//         import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
// import FaqTab from "../component/FaqTab";

// const ProductTabs = ({ productId }) => {
//   const [activeTab, setActiveTab] = useState("review");
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState({ customerName: "", rating: "", comment: "" });
//   const [editingId, setEditingId] = useState(null);
//   const [menuOpenId, setMenuOpenId] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const fetchReviews = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/review/product/${productId}`);
//         setReviews(res.data || []);
//     } catch (err) {
//       console.error("Error fetching reviews:", err);
//     }
//   };

//   useEffect(() => {
//     if(productId)
//     fetchReviews();
//   }, [productId]);

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     if (editingId) {
//       const res = await axios.put(`http://localhost:5000/api/review/${editingId}`, newReview);
//       if (res.data.review) {
//         setReviews((prev) =>
//           prev.map((r) => (r._id === editingId ? { ...r, ...newReview } : r))
//         );
//         setEditingId(null);
//       }
//     } else {
//       const res = await axios.post("http://localhost:5000/api/review", {
//         ...newReview,
//         productId,
//       });
//       if (res.data.review) {
//         setReviews((prev) => [...prev, res.data.review]);
//       }
//     }

//     setNewReview({ customerName: "", rating: "", comment: "" });
//     setShowForm(false);
//   } catch (err) {
//     console.error("Error submitting review:", err);
//   }
// };

//   const handleDelete = async (id) => {
//     try {
//       const res = await axios.delete(`http://localhost:5000/api/review/${id}`);
//       if (res.data.success) {
//         setReviews((prev) => prev.filter((r) => r._id !== id));
//       }
//     } catch (err) {
//       console.error("Error deleting review:", err);
//     }
//   };

//   const handleEdit = (review) => {
//     setNewReview({
//       customerName: review.customerName,
//       rating: review.rating,
//       comment: review.comment,
//     });
//     setEditingId(review._id);
//     setShowForm(true);
//   };

//   const renderTabContent = () => {
//     if (activeTab === "review") {
//       return (
//         <div className="bg-white">
//           {/* Header with review count and write review button */}
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 pb-4 border-b border-gray-100 gap-4">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
//               <div className="flex items-center gap-2 sm:gap-4">
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900">All Reviews</h3>
//                 <span className="text-gray-500 text-base sm:text-lg">({reviews.length})</span>
//               </div>
//               <div className="flex items-center gap-2 sm:gap-1 sm:ml-4">
//                 <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
//                 </svg>
//                 <select className="text-gray-600 bg-transparent border-none outline-none cursor-pointer text-sm sm:text-base">
//                   <option>Latest</option>
//                   <option>Oldest</option>
//                   {/* <option>Highest Rating</option>
//                   <option>Lowest Rating</option> */}
//                 </select>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowForm((prev) => !prev)}
//               className="bg-black text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-gray-800 transition font-medium text-sm sm:text-base w-full sm:w-auto"
//             >
//               {editingId ? "Edit Review" : "Write a Review"}
//             </button>
//           </div>

//           {showForm && (
//             <form
//               onSubmit={handleSubmit}
//               className="bg-gray-50 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 space-y-4 border border-gray-100"
//             >
//               <input
//                 type="text"
//                 placeholder="Your Name"
//                 value={newReview.customerName}
//                 onChange={(e) =>
//                   setNewReview({ ...newReview, customerName: e.target.value })
//                 }
//                 required
//                 className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-black focus:border-black outline-none text-sm sm:text-base"
//               />
//               <input
//                 type="number"
//                 min="1"
//                 max="5"
//                 placeholder="Rating (1 to 5)"
//                 value={newReview.rating}
//                 onChange={(e) =>
//                   setNewReview({ ...newReview, rating: e.target.value })
//                 }
//                 required
//                 className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-black focus:border-black outline-none text-sm sm:text-base"
//               />
//               <textarea
//                 placeholder="Your review"
//                 value={newReview.comment}
//                 onChange={(e) =>
//                   setNewReview({ ...newReview, comment: e.target.value })
//                 }
//                 required
//                 rows="4"
//                 className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-black focus:border-black outline-none resize-none text-sm sm:text-base"
//               />
//               <button
//                 type="submit"
//                 className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition w-full sm:w-auto text-sm sm:text-base"
//               >
//                 {editingId ? "Update Review" : "Submit Review"}
//               </button>
//             </form>
//           )}

//           {/* Reviews Grid - Single column on mobile, two columns on larger screens */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//             {reviews.map((rev) => (
//               <div
//                 key={rev._id}
//                 className="relative bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-all duration-200"
//               >
//                 {/* Star Rating */}
//                 <div className="flex mb-3 sm:mb-4">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <svg
//                       key={i}
//                       className={`w-4 h-4 sm:w-5 sm:h-5 ${
//                         i < parseInt(rev.rating) ? "text-yellow-400" : "text-gray-200"
//                       }`}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46 1.287 3.975c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.39 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.975-3.39-2.46c-.784-.57-.38-1.81.588-1.81h4.18l1.286-3.975z" />
//                     </svg>
//                   ))}
//                 </div>

//                 {/* Customer Name with Verified Badge */}
//                 <div className="flex items-center gap-2 mb-2 sm:mb-3">
//                   <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{rev.customerName}</h4>
//                   <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
//                     <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Review Comment */}
//                 <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4">
//                   "{rev.comment}"
//                 </p>

//                 {/* Posted Date */}
//                 <p className="text-gray-400 text-xs">
//                   Posted on {new Date().toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })}
//                 </p>

//                 {/* Menu Button */}
//                 <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
//                   <button
//                     onClick={() =>
//                       setMenuOpenId((prev) => (prev === rev._id ? null : rev._id))
//                     }
//                     className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//                   >
//                     <EllipsisVerticalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//                   </button>
//                   {menuOpenId === rev._id && (
//                     <div className="absolute right-0 mt-2 w-28 sm:w-32 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
//                       <button
//                         className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                         onClick={() => {
//                           handleEdit(rev);
//                           setMenuOpenId(null);
//                         }}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="block w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
//                         onClick={() => {
//                           handleDelete(rev._id);
//                           setMenuOpenId(null);
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     } else if (activeTab === "faq") {
//       return (
//        <FaqTab/>
//       );
//     } else {
//       return (
//          <div className="px-2 sm:px-0">
//       <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-2">Product Details</h3>
//       <div className="space-y-2 text-gray-600 text-sm">
//         <p>• 100% Cotton premium fabric for ultimate comfort</p>
//         <p>• Regular fit with breathable stitching</p>
//         <p>• Available in multiple sizes and colors</p>
//         <p>• Machine washable – easy to care for</p>
//         <p>• Lightweight material suitable for all seasons</p>
//         <p>• Designed with durability and daily wear in mind</p>
//       </div>
//     </div>
//       );
//     }
//   };

//   return (
//     <div className="mt-8 sm:mt-12 px-2 sm:px-4">
//       <div className="flex space-x-4 sm:space-x-8 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
//         <button
//           onClick={() => setActiveTab("review")}
//           className={`pb-3 sm:pb-4 px-1 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
//             activeTab === "review" 
//               ? "border-black text-black" 
//               : "border-transparent text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Rating & Reviews
//         </button>
//         <button
//           onClick={() => setActiveTab("faq")}
//           className={`pb-3 sm:pb-4 px-1 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
//             activeTab === "faq" 
//               ? "border-black text-black" 
//               : "border-transparent text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           FAQs
//         </button>
//         <button
//           onClick={() => setActiveTab("details")}
//           className={`pb-3 sm:pb-4 px-1 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
//             activeTab === "details" 
//               ? "border-black text-black" 
//               : "border-transparent text-gray-500 hover:text-gray-700"
//           }`}
//         >
//           Product Details
//         </button>
//       </div>

//       {renderTabContent()}
//     </div>
//   );
// };

// export default ProductTabs;