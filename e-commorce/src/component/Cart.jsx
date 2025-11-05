import React from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/CartStore";
import { FaTrashAlt } from "react-icons/fa";
import FooterSection from "./FooterSection";

const Cart = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price);
    const discountedPrice = item.discount
      ? price - (price * item.discount) / 100
      : price;
    return total + discountedPrice * item.quantity;
  }, 0);

  const discount = cartItems.reduce((total, item) => {
    if (!item.discount) return total;
    const price = parseFloat(item.price);
    return total + (price * item.discount / 100) * item.quantity;
  }, 0);

  const delivery = 15;
  const total = subtotal + delivery;

  return (
    <>
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Cart Items */}
      <div className="md:col-span-2">
        <h1 className="text-4xl  uppercase font-integral font-extrabold mb-6 mt-[100px]">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="bg-white p-4 rounded-2xl shadow space-y-6">
            {cartItems.map((item, index) => {
              const price = parseFloat(item.price);
              const discountedPrice = item.discount
                ? price - (price * item.discount) / 100
                : price;

              return (
                <div key={index} className="flex items-center justify-between border-b pb-6 last:border-none">
  {/* Product Info */}
  <div className="flex items-center gap-4">
    <img
      src={item.image}
      alt={item.title}
      className="w-20 h-20 object-cover rounded-lg"
    />
    <div>
      <h2 className="font-semibold text-lg">{item.title}</h2>
      <p className="text-sm text-gray-500">
        Size: {item.size} <br />
        Color: {item.color}
      </p>

      {/* 💰 Price Section */}
      <div className="mt-1">
     {item.discount ? (
  <div className="flex items-center gap-2">
    <p className="text-xl font-bold text-black">
      ${((parseFloat(item.price) * (100 - item.discount)) / 100).toFixed(0)}
    </p>
    <p className="text-sm text-gray-400 line-through">
      ${parseFloat(item.price).toFixed(0)}
    </p>
    <p className="text-sm text-red-500">-{item.discount}% OFF</p>
  </div>
) : (
    <p className="text-xl font-bold text-black">
    ${parseFloat(item.price).toFixed(0)}
  </p>
)}
      </div>
    </div>
  </div>    

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        decrementQuantity(item.id, item.color, item.size)
                    }
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-lg"
                    >
                      −
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                      onClick={() =>
                        incrementQuantity(item.id, item.color, item.size)
                      }
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                    <button
                        onClick={() => removeFromCart(
                            item.id, 
                            item.color
                            ,item.size)}
                            className="text-red-500 hover:text-red-600 text-xl"
                        >
                    <FaTrashAlt />
                    </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      {cartItems.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-300 h-fit mt-[100px]">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="flex justify-between mb-3 text-base">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(0)}</span>
          </div>

          {discount > 0 && (
              <div className="flex justify-between mb-3 text-base">
              <span className="text-gray-600">Discount (-%)</span>
              <span className="text-red-500">-${discount.toFixed(0)}</span>
            </div>
          )}

          <div className="flex justify-between mb-3 text-base">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">${delivery.toFixed(0)}</span>
          </div>

          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total</span>
            <span>${total.toFixed(0)}</span>
          </div>
          {/* 
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Add promo code"
              className="w-full rounded-full bg-gray-100 px-4 py-2 pr-24 text-sm outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white text-sm px-4 py-1.5 rounded-full">
              Apply
            </button>
          </div> 
          */}

          <Link
            to="/checkoutpage"
            className="block w-full bg-black text-white py-3 rounded-full font-semibold text-center hover:bg-black/90 transition"
            >
            Go to Checkout →
          </Link>
        </div>
      )}
    </div>
     <FooterSection/>
      </>
  );
};

export default Cart;
