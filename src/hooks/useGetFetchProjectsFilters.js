import { useEffect, useState } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

const axiosInstance = axios.create();

// Add request interceptor to include authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get the token from localStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//installe npm install axios-retry
axiosRetry(axiosInstance, {
  retries: 3, // Número de reintento
  retryDelay: (retryCount) => {
    return retryCount * 2000; // Retardo entre reintentos en milisegundos
  },
  shouldResetTimeout: false,
});

export const useGetFetchProjectsFilters = ({ rutaApi = "", filters = {} }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Don't fetch if no rutaApi provided
    if (!rutaApi) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let url = `https://pathexplorer-backend.onrender.com/api/${rutaApi}`;

      try {
        const response = await axiosInstance.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    const constructQueryParams = (filters) => {
      let filtros = [];
      for (const key in filters) {
        if (filters[key]) {
          filtros.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`
          );
        }
      }
      return filtros.length > 0 ? `?${filtros.join("&")}` : "";
    };

    const fetchDataFilters = async () => {
      const queryParams = constructQueryParams(filters);

      let url = `https://pathexplorer-backend.onrender.com/api/${rutaApi}${queryParams}`;

      try {
        const response = await axiosInstance.get(url);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching ${rutaApi}:`, error);
        setError(error);
        setLoading(false);
      }
    };

    if (Object.keys(filters).length > 0) {
      fetchDataFilters();
    } else {
      fetchData();
    }
  }, [filters]);

  return { data, error, loading };
};

export default useGetFetchProjectsFilters;
