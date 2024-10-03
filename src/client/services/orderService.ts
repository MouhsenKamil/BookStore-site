import axios from 'axios';

const API_URL = '/api/orders/';

export const createOrder = async (orderData: any) => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

export const getUserOrders = async (userId: string) => {
  const response = await axios.get(`${API_URL}user/${userId}`);
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await axios.get(`${API_URL}${id}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const response = await axios.put(`${API_URL}${id}`, { status });
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await axios.delete(`${API_URL}${id}`);
  return response.data;
};
