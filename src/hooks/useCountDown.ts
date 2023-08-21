import { useState, useEffect } from "react";

export const useCountDown = (initialCount: number) => {
  const [count, setCount] = useState<number>(initialCount);
  const [startCountDown, setStartCountDown] = useState(false);

  useEffect(() => {
    if (startCountDown) {
      const timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount === 1) {
            setStartCountDown(false);
            return prevCount;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [initialCount, startCountDown]);

  useEffect(() => {
    if (startCountDown) {
      setCount(initialCount);
    }
  }, [startCountDown, initialCount]);

  return { count, startCountDown, setStartCountDown };
};
