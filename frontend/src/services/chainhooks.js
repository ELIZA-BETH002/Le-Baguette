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

/**
 * Watch for NFT mint events
 * @param {Function} callback 
 */
export const watchMintEvents = (callback) => {
    // Placeholder for actual WebSocket subscription
    // client.subscribe('nft-mint', (event) => {
    //     callback(event);
    // });
    
    // Simulating event for development
    setTimeout(() => {
        callback({ type: 'mint', tokenId: 1, recipient: 'ST1...' });
    }, 5000);
};
