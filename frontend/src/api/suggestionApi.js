import axiosInstance from './axiosInstance';

export const suggestionApi = {
  getSuggestions: async () => {
    const response = await axiosInstance.get('/suggestions');
    return response.data;
  },
};

export default suggestionApi;
