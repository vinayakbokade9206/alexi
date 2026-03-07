// src/config.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
  GET_STATUS:          `${API_BASE_URL}/get-status`,
  START_CLASSROOM:     `${API_BASE_URL}/start-classroom`,
  START_MIMI_SESSION:  `${API_BASE_URL}/start-mimi-session`,
  GET_MIMI_STATUS:     `${API_BASE_URL}/mimi-get`,
  ACTIVITY_CHECK:      `${API_BASE_URL}/activity-check`,
  ACTIVITY_EVALUATE:   `${API_BASE_URL}/activity-evaluate`,
  ACTIVITY_SAVE_STARS: `${API_BASE_URL}/activity-save-stars`,
  ACTIVITY_GET_STARS:  (studentId) => `${API_BASE_URL}/activity-get-stars/${studentId}`,
};

export default { API_BASE_URL, API_ENDPOINTS };