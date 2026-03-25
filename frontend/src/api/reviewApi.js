import axiosInstance from './axiosInstance';

export const reviewApi = {
  createReview: async (review) => {
    const response = await axiosInstance.post('/reviews', review);
    return response.data;
  },
  deleteReview: async (reviewId) => {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewApi;
