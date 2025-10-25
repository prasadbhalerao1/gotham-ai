import api from '../config/api';

export const contactService = {
  // Submit contact form
  submitContact: async (data) => {
    return await api.post('/contact', data);
  },
};

export default contactService;
