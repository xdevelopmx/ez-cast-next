import { useState, useEffect, useRef } from "react";

const useTimeout = (delay: number) => {
  const delay_time_ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!delay_time_ref.current) {
      delay_time_ref.current = setTimeout(() => {
        setFinished(true);
        clearTimeout(this);
        delay_time_ref.current = null;
      }, delay);
      setFinished(false);
    }
    return () => {
      if (delay_time_ref.current) {
        clearTimeout(delay_time_ref.current);
        delay_time_ref.current = null;
      }
    };
  }, [delay]);

  return finished;
};

export default useTimeout;
