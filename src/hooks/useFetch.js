import { useEffect, useState, useCallback } from "react";
import axios from "axios";

/**
 * Hook simple para GET con loading, error y data
 * @param {string} ruta - Parte final de la URL (después de /api/)
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useFetch = (ruta, body = null) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!ruta) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const url = `https://pathexplorer-backend.onrender.com/api/${ruta}`;
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      let response;
      if (body && typeof body === "string") {
        response = await axios.get(url, body, config);
      } else {
        response = await axios.get(url, config);
      }
      setData(response.data);
    } catch (err) {
      const errorMessage = err.response.data.error;
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  }, [ruta, body]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
};

export default useFetch;
