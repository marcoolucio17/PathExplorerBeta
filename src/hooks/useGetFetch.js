import { useEffect, useState } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosRetry(axiosInstance, {
  retries: 1, // Número de reintentos
  retryDelay: (retryCount) => {
    return retryCount * 2000;
  },
  shouldResetTimeout: false,
});

export const useGetFetch = ({rutaApi = ""}) => {
    const [data,setData] = useState([]);  
    const [error,setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!rutaApi) return; //don't fetch if no rutaApi provided
            
            let url = `https://pathexplorer-backend.onrender.com/api/${rutaApi}`;
            //let url = `http://localhost:8080/api/${rutaApi}`;
            
            try {
                const response = await axiosInstance.get(url);
                setData(response.data)
            } catch (error) {
                console.error(`Error fetching ${rutaApi}:`, error);
                setError(error);
            }
        };  
        fetchData();
    }, [rutaApi]); //added rutaApi dependency to fix infinite loop

  return { data, error };
};

export default useGetFetch;
