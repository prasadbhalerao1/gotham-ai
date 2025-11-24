import api from '../config/api';

export const projectService = {
  getAllProjects: async (params = {}) => {
    return await api.get('/projects', { params });
  },
  getProjectBySlug: async (slug) => {
    return await api.get(`/projects/${slug}`);
  },
};

export default projectService;

