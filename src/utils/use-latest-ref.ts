import { useEffect, useRef } from "react";

/**
 * Mirrors a value into a ref that always reflects the latest render.
 * Useful inside callbacks (e.g. react-dnd) that retain stale closures.
 */
export const useLatestRef = <T,>(value: T) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
};
