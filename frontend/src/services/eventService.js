import api from '../config/api';

export const eventService = {
  // Get all events
  getAllEvents: async (params = {}) => {
    return await api.get('/events', { params });
  },

  // Get event by slug
  getEventBySlug: async (slug) => {
    return await api.get(`/events/${slug}`);
  },
};

export default eventService;
