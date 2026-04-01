import axiosInstance from './axiosInstance';

export const userApi = {
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  },
  updateProfile: async (payload) => {
    const response = await axiosInstance.put('/users/me', payload);
    return response.data;
  },
  updatePassword: async (payload) => {
    const response = await axiosInstance.put('/users/me/password', payload);
    return response.data;
  },
  getUserById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  }
};

export default userApi;