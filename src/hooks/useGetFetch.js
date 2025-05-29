import React, { useEffect,useState, useCallback } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';


const axiosInstance = axios.create();

// Add request interceptor to include authentication token
axiosInstance.interceptors.request.use(
    (config) => {
        // Try to get the token from localStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
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
    retries: 3, // Número de reintentos
    retryDelay: (retryCount) => {
        return retryCount * 2000; 
    },
    shouldResetTimeout: true, 

});

export const useGetFetch = ({rutaApi = ""}) => {

    const [data,setData] = useState([]);  
    const [error,setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            //let url = `https://pathexplorer-backend.onrender.com/api/${rutaApi}`;
            let url = `http://localhost:8080/api/${rutaApi}`;
            
            try {
                const response = await axiosInstance.get(url);
                setData(response.data)
            } catch (error) {
                console.error(`Error fetching ${rutaApi}:`, error);
                setError(error);
            }
        };  
        fetchData();
    }, []);

    return { data, error };
}

export default useGetFetch;