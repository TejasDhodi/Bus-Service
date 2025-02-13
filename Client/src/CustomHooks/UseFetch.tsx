import axios from "axios";
import { useEffect, useState } from "react";

const UseFetch = <T,>(url: string, reload?: boolean) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleFetchResponse = async () => {
    try {
      const { status, data } = await axios.get(url);
      if (status === 200) {
        setData(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchResponse();
  }, [url, reload]); 

  return { data, loading };
};

export default UseFetch;
