/**
 * Service: storage
 * Handles external integrations
 */
export const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));