import axios from "axios";

const api = axios.create({
     baseURL:"http://localhost:5000/api"
})


export const fetchPaginatedReviews = async (page = 1, limit = 3) => {
  const response = await api.get(`/review?page=${page}&limit=${limit}`);
  return response.data;
};  


              //Order Api's


const BASE_URL = "http://localhost:5000/api";

export const fetchOrders = async () => {
  const res = await axios.get(`${BASE_URL}/orders`);
  return res.data;
};

export const updateOrder = async ({ id, status }) => {
  const res = await axios.put(`${BASE_URL}/order/${id}`, { status });
  return res.data;
};

export const cancelOrder = async (id) => {
  const res = await axios.delete(`${BASE_URL}/order/${id}`);
  return res.data;
};

export const deleteAllOrders = async () => {
  const res = await axios.delete(`${BASE_URL}/orders`);
  return res.data;
};