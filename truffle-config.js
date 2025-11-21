/**
 * Truffle Configuration for Hash-Heros NFT Project
 * Supports local development and BlockDAG Awakening Testnet deployment
 */

module.exports = {
  /**
   * Networks: Define how to connect to different blockchains
   * 
   * Development: Local Ganache instance for testing
   * BlockDAG Awakening: Remote testnet for live testing
   */
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,           // Ganache default port
      network_id: "*"       // Match any network id
    },

    /**
     * BlockDAG Awakening Testnet
     * Chain ID: 1043
     * RPC URL: https://rpc.awakening.bdagscan.com
     * Block Explorer: https://awakening.bdagscan.com
     * 
     * To deploy:
     * 1. Install @truffle/hdwallet-provider: npm install @truffle/hdwallet-provider
     * 2. Set PRIVATE_KEY environment variable (32-byte hex string without 0x)
     *    OR set MNEMONIC environment variable (12-word seed phrase)
     * 3. Run: truffle migrate --network blockdag_awakening
     * 
     * Example:
     *   export PRIVATE_KEY=abcdef1234567890...
     *   truffle migrate --network blockdag_awakening
     */
    blockdag_awakening: {
      provider: () => {
        const HDWalletProvider = require('@truffle/hdwallet-provider');
        const privateKeyOrMnemonic = process.env.PRIVATE_KEY || process.env.MNEMONIC;
        
        if (!privateKeyOrMnemonic) {
          throw new Error(
            'Deployment to BlockDAG requires PRIVATE_KEY or MNEMONIC environment variable.\n' +
            'Usage: export PRIVATE_KEY=<your-private-key> && truffle migrate --network blockdag_awakening\n' +
            'Or: export MNEMONIC="word1 word2 ..." && truffle migrate --network blockdag_awakening'
          );
        }
        
        return new HDWalletProvider(
          privateKeyOrMnemonic, 
          'https://rpc.awakening.bdagscan.com',
          0,  // Account index
          1   // Number of accounts to derive
        );
      },
      network_id: 1043,
      gasPrice: 1000000000,  // 1 Gwei
      gas: 5000000,          // Max gas limit per block
      confirmations: 1,      // Wait for 1 confirmation
      timeoutBlocks: 200,    // Timeout after 200 blocks
      skipDryRun: true       // Skip simulation before deployment
    }
  },

  /**
   * Compiler Configuration
   * Solidity version 0.8.20 supports latest features and security improvements
   */
  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200          // Balance between code size and execution cost
        }
      }
    }
  }
};
