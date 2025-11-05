// src/pages/Orders.jsx

import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchOrders,
  updateOrder,
  cancelOrder,
  deleteAllOrders
} from "../API/Api";
import { toast } from "react-toastify";

const Order = () => {
  const queryClient = useQueryClient();

  // 🔹 Fetch Orders
  const {
    data = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  // 🔹 Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      toast.success("Order deleted");
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => toast.error("Delete failed"),
  });

  // 🔹 Update Status Mutation
  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => toast.error("Update failed"),
  });

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Error loading orders.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {data.orders?.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded mb-4 bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p className="text-sm text-gray-600">
              Status: {order.status}
            </p>
          </div>
          <p>Total: ${order.total}</p>
          <div className="flex gap-3 mt-3">
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={() => deleteMutation.mutate(order._id)}
            >
              Delete
            </button>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={() =>
                updateMutation.mutate({
                  id: order._id,
                  status: "delivered",
                })
              }
            >
              Mark as Delivered
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Order;
