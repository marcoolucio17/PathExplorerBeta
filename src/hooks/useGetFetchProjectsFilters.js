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
  retries: 0, // Número de reintento
  shouldResetTimeout: false,
});

export const useGetFetchProjectsFilters = ({ rutaApi = "", filters = {} }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let url = `http://localhost:8080/api/${rutaApi}`;

      try {
        const response = await axiosInstance.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
      }
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
      console.log(`Fetching data with filters: ${queryParams}`);
      let url = `http://localhost:8080/api/${rutaApi}${queryParams}`;
      console.log(`Constructed URL: ${url}`);
      try {
        const response = await axiosInstance.get(url);
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching ${rutaApi}:`, error);
        setError(error);
      }
    };

    if (Object.keys(filters).length > 0) {
      console.log("Filters provided, fetching filtered data");
      fetchDataFilters();
    } else {
      console.log("No filters provided, fetching all data");
      fetchData();
    }
  }, [filters]);

  return { data, error };
};

export default useGetFetchProjectsFilters;
