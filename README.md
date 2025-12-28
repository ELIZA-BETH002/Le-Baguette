# **Le Baguette - A French-Themed NFT Collection Contract**

## **Overview**
Le Baguette is a Clarity smart contract designed to enable the minting, management, and transfer of artisan baguette-themed NFTs. Each NFT features unique, randomly generated attributes inspired by French bakery culture. The contract also supports a whitelist mechanism, royalties on secondary sales, and administrative functions.


## **Features**
1. **Minting:**
   - Public and whitelist minting options.
   - Each NFT includes attributes like crust type, filling, flavor, length, and rarity.
   - Unique traits such as organic, gluten-free, and seeded status.

2. **Whitelist Support:**
   - Discounted minting price for whitelist members.
   - Easy management of whitelist entries.

3. **Randomization:**
   - Uses block height and token ID to generate random attributes and traits.

4. **Royalties:**
   - Enforces a 5% royalty on secondary sales.

5. **Administrative Controls:**
   - Update minting price.
   - Add or remove addresses from the whitelist.
   - Reveal the collection metadata.
   - Withdraw contract funds.

6. **Transfer Functionality:**
   - Secure transfer of ownership with royalties paid to the contract owner.



## **Contract Details**

### **NFT Attributes**
Each baguette NFT includes:
- **Crust:** Crispy, Soft, Chewy, Flaky, Crunchy.
- **Filling:** Cheese, Ham, Butter, Jam, Empty.
- **Flavor:** Classic, Garlic, Olive, Herb, Sourdough.
- **Length:** Between 20 cm and 30 cm.
- **Rarity:** Common, Uncommon, Rare, Epic, Legendary.

### **Traits**
- **Organic:** 30% chance.
- **Gluten-Free:** 10% chance.
- **Has Seeds:** 50% chance.



## **Key Functions**

### **Public Functions**
1. **`mint-baguette`**
   - Mint a new baguette NFT at the current mint price.
   - Requires STX payment and enforces maximum supply limits.

2. **`whitelist-mint`**
   - Mint a new baguette NFT at a discounted price for whitelist users.
   - Automatically removes the user from the whitelist after minting.

3. **`transfer`**
   - Transfer NFT ownership.
   - Enforces royalties on secondary sales.



### **Read-Only Functions**
1. **`get-last-token-id`**: Returns the ID of the last minted NFT.
2. **`get-owner`**: Returns the owner of a specified NFT.
3. **`get-token-attributes`**: Fetches an NFT's attributes by token ID.
4. **`get-token-traits`**: Fetches an NFT's traits by token ID.
5. **`is-whitelisted`**: Checks if an address is whitelisted.


### **Admin Functions**
1. **`set-mint-price`**: Update the public mint price.
2. **`set-whitelist-mint-price`**: Update the whitelist mint price.
3. **`add-to-whitelist`**: Add an address to the whitelist.
4. **`remove-from-whitelist`**: Remove an address from the whitelist.
5. **`set-base-uri`**: Update the metadata base URI.
6. **`reveal-collection`**: Reveal the collection metadata.
7. **`set-royalty-percent`**: Adjust the royalty percentage.
8. **`withdraw-funds`**: Withdraw STX funds from the contract.



## **Constants**
- **`contract-owner`**: The address that deployed the contract.
- **Errors:**
  - `err-sold-out` (101): All NFTs have been minted.
  - `err-insufficient-funds` (102): Insufficient STX for minting.
  - `err-not-owner` (103): Caller is not the owner of the NFT or contract.
  - `err-already-minted` (104): NFT already minted.
  - `err-not-whitelisted` (105): Address not on the whitelist.
  - `err-invalid-token` (106): Token does not exist.
  - `err-not-revealed` (107): Metadata has not been revealed.
  - `err-invalid-percentage` (108): Invalid royalty percentage.



## **Minting Prices**
- **Public Mint:** 0.5 STX.
- **Whitelist Mint:** 0.25 STX.
- **Max Supply:** 1,000 NFTs.



## **Royalty System**
On secondary transfers, 5% of the transaction is sent to the contract owner.



## **Metadata**
- **Base URI:** `https://le-baguette-nft.com/metadata/`
- Metadata can be revealed or hidden by the admin.


## **Getting Started**

1. **Deploy the Contract:**
   - Use a Stacks-compatible wallet or development tools to deploy the contract.

2. **Set Initial Parameters:**
   - Adjust mint prices, whitelist, and other settings via admin functions.

3. **Mint NFTs:**
   - Users can mint baguettes through `mint-baguette` or `whitelist-mint`.

4. **Transfer NFTs:**
   - Use `transfer` to facilitate secure trades.

5. **Manage Whitelist:**
   - Admin can add or remove users from the whitelist as needed.



## **Future Enhancements**
- Multi-signature wallet support.
- Integration with decentralized marketplaces.
- Enhanced randomization for traits.


## **License**
This contract is open-source under the MIT License. Feel free to fork and adapt it for your own projects.

// 🥖