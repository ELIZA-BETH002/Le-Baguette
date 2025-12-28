/**
 * Hook: useMount
 * Usage: See implementation
 */
import { useEffect } from "react"; export const useMount = (fn) => useEffect(() => { fn(); }, []);