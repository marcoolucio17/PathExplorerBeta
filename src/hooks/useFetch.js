import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
/**
 * hook simple para GET con loading, error y data
 * @param {string} ruta
 * @returns data, loading & error
 */
export const useFetch = (ruta, body = null) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //dont fetch if ruta is null or undefined
    if (!ruta) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      let url = `https://pathexplorer-backend.onrender.com/api/${ruta}`;
    try {
      let response;
      const config = {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      if (body && typeof body === "string") {
        response = await axios.get(url, body, config);
      } else {
        response = await axios.get(url, config);
      }
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
      try {
        let response;
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
      response = await axios.get(url, config);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [ruta]);

  return { data, error, loading };
};

export default useFetch;
