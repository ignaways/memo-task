import { useEffect, useState } from "react";

export default function useDelayedFlag(active, delay) {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (!active) {
      setFlag(false);
      return undefined;
    }
    const timer = setTimeout(() => setFlag(true), delay);
    return () => clearTimeout(timer);
  }, [active, delay]);

  return flag;
}
