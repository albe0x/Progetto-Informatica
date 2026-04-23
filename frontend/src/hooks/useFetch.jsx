import { useState, useCallback } from 'react';
import { getCookie } from '../helpers/cookieHelper';

const useFetch = (baseUrl = '') => {
  const [data, setData] = useState(null); // <--- Nuovo stato per i dati
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, method = 'GET', body = null, customHeaders = {}) => {
    setLoading(true);
    setError(null);

    const token = getCookie('authorization');

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `${token}` }),
        ...customHeaders,
      },
    };

    if (body) config.body = JSON.stringify(body);

    try {
      const response = await fetch(`${baseUrl}${url}`, config);
      const result = response.status !== 204 ? await response.json() : null;

      if (!response.ok) {
        throw new Error(result?.message || `Errore: ${response.status}`);
      }

      setData(result);
      setLoading(false);
      return result; 
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [baseUrl]);

  return { request, data, loading, error }; 
};

export default useFetch;

/*
 const { request, data, loading, error } = useFetch('https://esempio.com');

 request('/profile', 'POST', {}, )

*/
