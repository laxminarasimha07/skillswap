import axiosInstance from './axiosInstance';

export const sessionApi = {
  proposeSession: async (proposal) => {
    const response = await axiosInstance.post('/sessions', proposal);
    return response.data;
  },
  confirmSession: async (sessionId, selectedSlot) => {
    const response = await axiosInstance.put(`/sessions/${sessionId}/confirm?selectedSlot=${selectedSlot}`);
    return response.data;
  },
  cancelSession: async (sessionId) => {
    const response = await axiosInstance.put(`/sessions/${sessionId}/cancel`);
    return response.data;
  },
  completeSession: async (sessionId) => {
    const response = await axiosInstance.put(`/sessions/${sessionId}/complete`);
    return response.data;
  },
  getMySessions: async () => {
    const response = await axiosInstance.get('/sessions');
    return response.data;
  }
};

export default sessionApi;
