import axiosInstance from './axiosInstance';

export const messageApi = {
  getChatHistory: async (userId) => {
    const response = await axiosInstance.get(`/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (receiverId, message, fileUrl = null) => {
    const response = await axiosInstance.post('/messages', {
      receiverId,
      message,
      fileUrl,
    });
    return response.data;
  },
};

export default messageApi;
