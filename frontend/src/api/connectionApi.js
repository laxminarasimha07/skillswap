import axiosInstance from './axiosInstance';

export const connectionApi = {
  sendRequest: async (receiverId) => {
    const response = await axiosInstance.post(`/connections/request?receiverId=${receiverId}`);
    return response.data;
  },
  acceptRequest: async (connectionId) => {
    const response = await axiosInstance.put(`/connections/${connectionId}/accept`);
    return response.data;
  },
  rejectRequest: async (connectionId) => {
    const response = await axiosInstance.put(`/connections/${connectionId}/reject`);
    return response.data;
  },
  blockUser: async (blockedId) => {
    const response = await axiosInstance.put(`/connections/block?blockedId=${blockedId}`);
    return response.data;
  },
  getConnections: async () => {
    const response = await axiosInstance.get('/connections');
    return response.data;
  }
};

export default connectionApi;
