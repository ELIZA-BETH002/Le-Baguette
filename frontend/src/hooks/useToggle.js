/**
 * Hook: useToggle
 * Usage: See implementation
 */
import { useState } from "react"; export const useToggle = (initial) => { const [state, set] = useState(initial); return [state, () => set(!state)]; };