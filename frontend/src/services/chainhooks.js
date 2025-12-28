import { ChainhooksClient } from '@hirosystems/chainhooks-client';

const API_KEY = import.meta.env.VITE_CHAINHOOKS_API_KEY;

export const client = new ChainhooksClient({
    apiKey: API_KEY,
    network: 'testnet' 
});

/**
 * Initialize Chainhooks connection
 */
export const initChainhooks = () => {
    // console.debug('Initializing Chainhooks...');
};
