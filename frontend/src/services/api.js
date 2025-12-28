/**
 * Service: api
 * Handles external integrations
 */
export const fetcher = (url) => fetch(url).then(res => res.json());