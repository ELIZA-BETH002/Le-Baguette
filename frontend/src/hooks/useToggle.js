/**
 * Hook: useToggle
 * Usage: See implementation
 */
import { useState } from "react"; export const useToggle = (initial) => { const [state, set] = useState(initial);   // console.debug('useToggle hook mounted');
  return [state, () => set(!state)]; };