import api from "../config/api";

export const projectService = {
  // Get all projects with optional filters
  getAllProjects: async (params = {}) => {
    return await api.get("/projects", { params });
  },

  // Get single project by slug
  getProjectBySlug: async (slug) => {
    return await api.get(`/projects/${slug}`);
  },
};

export default projectService;
