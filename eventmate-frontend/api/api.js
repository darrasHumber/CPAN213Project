import axios from 'axios';

// Change this to your backend URL
// For local development: use your computer's IP address
// Example: 'http://192.168.1.100:5000/api'
// For Android emulator: 'http://10.0.2.2:5000/api'
const API_BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ============================================
// EVENTS API
// ============================================

export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const getEventDetails = async (id) => {
  try {
    const response = await api.get(`/events/${id}/details`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};

export const getEventStats = async (id) => {
  try {
    const response = await api.get(`/events/${id}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event stats:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// ============================================
// GUESTS API
// ============================================

export const getGuestsByEvent = async (eventId) => {
  try {
    const response = await api.get(`/guests/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching guests:', error);
    throw error;
  }
};

export const getGuestStats = async (eventId) => {
  try {
    const response = await api.get(`/guests/event/${eventId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching guest stats:', error);
    throw error;
  }
};

export const addGuest = async (guestData) => {
  try {
    const response = await api.post('/guests', guestData);
    return response.data;
  } catch (error) {
    console.error('Error adding guest:', error);
    throw error;
  }
};

export const addGuestsBulk = async (eventId, guests) => {
  try {
    const response = await api.post('/guests/bulk', { eventId, guests });
    return response.data;
  } catch (error) {
    console.error('Error adding guests:', error);
    throw error;
  }
};

export const updateGuest = async (id, guestData) => {
  try {
    const response = await api.put(`/guests/${id}`, guestData);
    return response.data;
  } catch (error) {
    console.error('Error updating guest:', error);
    throw error;
  }
};

export const updateGuestRSVP = async (id, rsvpStatus) => {
  try {
    const response = await api.patch(`/guests/${id}/rsvp`, { rsvpStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating RSVP:', error);
    throw error;
  }
};

export const deleteGuest = async (id) => {
  try {
    const response = await api.delete(`/guests/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting guest:', error);
    throw error;
  }
};

// ============================================
// VENDORS API
// ============================================

export const getVendorsByEvent = async (eventId) => {
  try {
    const response = await api.get(`/vendors/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

export const getVendorStats = async (eventId) => {
  try {
    const response = await api.get(`/vendors/event/${eventId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    throw error;
  }
};

export const addVendor = async (vendorData) => {
  try {
    const response = await api.post('/vendors', vendorData);
    return response.data;
  } catch (error) {
    console.error('Error adding vendor:', error);
    throw error;
  }
};

export const addVendorsBulk = async (eventId, vendors) => {
  try {
    const response = await api.post('/vendors/bulk', { eventId, vendors });
    return response.data;
  } catch (error) {
    console.error('Error adding vendors:', error);
    throw error;
  }
};

export const updateVendor = async (id, vendorData) => {
  try {
    const response = await api.put(`/vendors/${id}`, vendorData);
    return response.data;
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};

export const updateVendorStatus = async (id, status) => {
  try {
    const response = await api.patch(`/vendors/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating vendor status:', error);
    throw error;
  }
};

export const deleteVendor = async (id) => {
  try {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
};

export default api;
