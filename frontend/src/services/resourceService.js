import api from '../config/api';

export const resourceService = {
  // Get all resources
  getAllResources: async (params = {}) => {
    return await api.get('/resources', { params });
  },

  // Get featured resources
  getFeaturedResources: async () => {
    return await api.get('/resources/featured');
  },

  // Get resource by slug
  getResourceBySlug: async (slug) => {
    return await api.get(`/resources/${slug}`);
  },
};

export default resourceService;
