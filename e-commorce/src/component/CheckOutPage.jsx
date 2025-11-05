// import React, { useEffect, useState } from "react";
// import useCartStore from "../store/CartStore";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import useAuthStore from "../store/AuthStore";
// import AuthModal from "../Auth/AuthModel";
// import { toast, ToastContainer , Bounce } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CheckOutPage = () => {
//   const navigate = useNavigate();
//   const cartItems = useCartStore((state) => state.cartItems);
//   const clearCart = useCartStore((state) => state.clearCart);
//   const [openAuthModal, setOpenAuthModal] = useState(false);
//   const token = useAuthStore((state) => state.token); 
  
//   const subtotal = cartItems.reduce((total, item) => {
//     const price = parseFloat(item.price);
//     const discountedPrice = item.discount
//       ? price - (price * item.discount) / 100
//       : price;
//     return total + discountedPrice * item.quantity;
//   }, 0);

//   const totalDiscount = cartItems.reduce((total, item) => {
//     if (!item.discount) return total;
//     const price = parseFloat(item.price);
//     return total + ((price * item.discount) / 100) * item.quantity;
//   }, 0);

//   const deliveryFee = 15;
//   const total = subtotal + deliveryFee;

//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     paymentMethod: "",
//   });

//   // validation logic
//   const isFormValid = Object.values(formData).every(
//     (val) => typeof val === "string" && val.trim() !== ""
//   );

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleOrder = async () => {
//      if (!token) {
//       toast.error("You have to Login first",{
//        position: "top-right",
//        autoClose: 2000,
//        theme: "colored",
//        transition: Bounce, 
//       }
//       )
//       setOpenAuthModal(true); 
//       return;
//     }
//     try {
//       setLoading(true);
//       const orderPayload = {
//         ...formData,
//         cart: cartItems,
//         subtotal,
//         discount: totalDiscount,
//         delivery: deliveryFee,
//         total,
//       };
      
//       const res = await axios.post(
//         "http://localhost:5000/api/order",
//         orderPayload
//       );
//       if (res.data.success) {
//          clearCart();
//         navigate("/order-success");
//       }
//     } catch (err) {
//       console.error("Order failed:", err);
//       alert("Failed to place order");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//           <>
//     <div className="max-w-6xl mx-auto p-6 mt-[110px] grid grid-cols-1 md:grid-cols-2 gap-10 ">
    
//       <div className="bg-white shadow-sm border rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Shipping Information
//         </h2>
//         <form className="space-y-5">
//           {[
//             { name: "name", label: "Full Name" },
//             { name: "email", label: "Email Address" },
//             { name: "phone", label: "Phone Number" },
//             { name: "address", label: "Street Address" },
//             { name: "city", label: "City" },
//             { name: "postalCode", label: "Postal Code" },
//           ].map((field) => (
//             <div key={field.name}>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 {field.label}
//               </label>
//               <input
//                 name={field.name}
//                 value={formData[field.name]}
//                 onChange={handleChange}
//                 required
//                 placeholder={field.label}
//                 className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>
//           ))}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Payment Method
//             </label>
//             <select
//               name="paymentMethod"
//               value={formData.paymentMethod}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
//             >
//               <option value="" disabled>
//                 Select Payment Method
//               </option>
//               <option value="Cash on Delivery">Cash on Delivery</option>
//               <option value="Credit Card">Credit Card</option>
//               <option value="Easypaisa/JazzCash">Easypaisa/JazzCash</option>
//             </select>
//           </div>
//         </form>
//       </div>

      
//       <div className="bg-white shadow-sm border rounded-lg p-6 h-fit">
//         <h2 className="text-xl font-bold mb-6">Order Summary</h2>

//         <div className="flex justify-between mb-3">
//           <span>Subtotal</span>
//           <span>${subtotal.toFixed(0)}</span>
//         </div>

//         {totalDiscount > 0 && (
//           <div className="flex justify-between mb-3 text-red-500">
//             <span>Discount</span>
//             <span>−${totalDiscount.toFixed(0)}</span>
//           </div>
//         )}

//         <div className="flex justify-between mb-3">
//           <span>Delivery Fee</span>
//           <span>${deliveryFee.toFixed(0)}</span>
//         </div>

//         <hr className="my-4" />

//         <div className="flex justify-between font-bold text-lg">
//           <span>Total</span>
//           <span>${total.toFixed(0)}</span>
//         </div>

//         <button
//           onClick={handleOrder}
//           disabled={loading || !isFormValid}
//           className={`w-full mt-6 py-3 rounded-full font-semibold transition ${
//             loading || !isFormValid
//               ? "bg-gray-400 text-white cursor-not-allowed"
//               : "bg-black text-white"
//           }`}
//         >
//           {loading
//             ? "Placing Order..."
//             : !isFormValid
//             ? "Please fill all fields"
//             : "Place Order"}
//         </button>
//       </div>
//     </div>

//       <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} /> 
//         <ToastContainer/>
//       </>
//   );
// }
  
// export default CheckOutPage;
import React, { useState } from "react";
import useCartStore from "../store/CartStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import AuthModal from "../Auth/AuthModel";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckOutPage = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const token = useAuthStore((state) => state.token);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price);
    const discountedPrice = item.discount
      ? price - (price * item.discount) / 100
      : price;
    return total + discountedPrice * item.quantity;
  }, 0);

  const totalDiscount = cartItems.reduce((total, item) => {
    if (!item.discount) return total;
    const price = parseFloat(item.price);
    return total + ((price * item.discount) / 100) * item.quantity;
  }, 0);

  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "",
  });

  const isFormValid = Object.values(formData).every(
    (val) => typeof val === "string" && val.trim() !== ""
  );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrderClick = () => {
    if (!token) {
      toast.error("You have to Login first", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });
      setOpenAuthModal(true);
      return;
    }
    setOpenConfirmModal(true);
  };

  const handleOrder = async () => {
    try {
      setLoading(true);
      const orderPayload = {
        ...formData,
        cart: cartItems,
        subtotal,
        discount: totalDiscount,
        delivery: deliveryFee,
        total,
      };

      const res = await axios.post(
        "http://localhost:5000/api/order",
        orderPayload
      );
      if (res.data.success) {
        clearCart();
        navigate("/order-success");
      }
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setOpenConfirmModal(false);
    handleOrder();
  };

  return (
    <>
      {/* ✅ Blur background if modal open */}
      <div className={`${openConfirmModal ? "blur-sm scale-[0.98]" : ""} transition-all duration-300`}>
        <div className="max-w-6xl mx-auto p-6 mt-[110px] grid grid-cols-1 md:grid-cols-2 gap-10">

         {/* LEFT SIDE FORM */}
          <div className="bg-white shadow-sm border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Shipping Information
            </h2>
            <form className="space-y-5">
              {[
                { name: "name", label: "Full Name" },
                { name: "email", label: "Email Address" },
                { name: "phone", label: "Phone Number" },
                { name: "address", label: "Street Address" },
                { name: "city", label: "City" },
                { name: "postalCode", label: "Postal Code" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.label}
                    required
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-black"
                >
                  <option value="" disabled>
                    Select Payment Method
                  </option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Easypaisa/JazzCash">Easypaisa/JazzCash</option>
                </select>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE ORDER SUMMARY */}
          <div className="bg-white shadow-sm border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(0)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between mb-3 text-red-500">
                <span>Discount</span>
                <span>- ${totalDiscount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between mb-3">
              <span>Delivery Fee</span>
              <span>${deliveryFee}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(0)}</span>
            </div>

            <button
              onClick={handlePlaceOrderClick}
              disabled={loading || !isFormValid}
              className={`w-full mt-6 py-3 rounded-full font-semibold transition ${
                loading || !isFormValid
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {loading
                ? "Placing Order..."
                : !isFormValid
                ? "Please fill all fields"
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Confirmation Modal with Blur + Animation */}
      {openConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-[90%] sm:w-[380px] text-center animate-[zoomIn_0.3s]">
            <h2 className="text-xl font-bold mb-2">Confirm Order</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to place this order?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-black text-white rounded-full hover:scale-105 transition"
              >
                Yes, Order
              </button>
              <button
                onClick={() => setOpenConfirmModal(false)}
                className="px-5 py-2 bg-gray-300 rounded-full hover:scale-105 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
      <ToastContainer />
    </>
  );
};

export default CheckOutPage;
