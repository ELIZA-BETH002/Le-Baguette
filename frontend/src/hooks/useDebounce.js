/**
 * Hook: useDebounce
 * Usage: See implementation
 */
import { useState, useEffect } from "react"; export function useDebounce(value, delay) { const [debouncedValue, setDebouncedValue] = useState(value); useEffect(() => { const handler = setTimeout(() => { setDebouncedValue(value); }, delay);   // console.debug('useDebounce hook mounted');
  return () => { clearTimeout(handler); }; }, [value, delay]); return debouncedValue; }