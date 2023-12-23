import axios, { AxiosError } from 'axios';

// Function to set the authorization token
export const setAuthToken = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Axios request interceptor
axios.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., adding headers)
    setAuthToken(localStorage.getItem('token'));
    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  },
);

// Axios response interceptor
axios.interceptors.response.use(
  (response) => {
    // You can modify the response here (e.g., handling common errors)
    return response;
  },
  (error: AxiosError) => {
    // Handle response error
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default axios;
