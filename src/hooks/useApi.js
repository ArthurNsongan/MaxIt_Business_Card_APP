// src/hooks/useApi.js
import { useState, useCallback } from 'react';

const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Execute the API call
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError('');
      const result = await apiFunc(...args);
      setData(result);
      return { data: result, error: null };
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return {
    data,
    error,
    loading,
    execute,
  };
};

export default useApi;