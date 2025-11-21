/**
 * BlockDAG Transaction Tests
 * 
 * Tests for the blockdagTransaction.js service that handles
 * transaction creation, status tracking, and BlockDAG-specific operations.
 */

import {
  BlockDAGTransaction,
  transferNFTInstant,
  mintDynamicNFT,
  getTransactionStatus,
  toWei,
  fromWei
} from '../blockdagTransaction';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage for transactionStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('BlockDAGTransaction', () => {
  describe('BlockDAGTransaction class', () => {
    test('should create a transaction instance', () => {
      const tx = new BlockDAGTransaction(
        '0x123',
        '0xuser1',
        '0xuser2',
        '100',
        'transfer'
      );

      expect(tx.hash).toBe('0x123');
      expect(tx.from).toBe('0xuser1');
      expect(tx.to).toBe('0xuser2');
      expect(tx.value).toBe('100');
      expect(tx.type).toBe('transfer');
      expect(tx.status).toBe('pending');
      expect(tx.confirmations).toBe(0);
    });

    test('should generate correct explorer URL', () => {
      const tx = new BlockDAGTransaction(
        '0x123',
        '0xuser1',
        '0xuser2',
        '100',
        'transfer'
      );

      const url = tx.getExplorerUrl();
      expect(url).toContain('0x123');
      expect(url).toContain('awakening.bdagscan.com');
    });

    test('should serialize to JSON', () => {
      const tx = new BlockDAGTransaction(
        '0x123',
        '0xuser1',
        '0xuser2',
        '100',
        'transfer'
      );

      const json = tx.toJSON();
      expect(json.hash).toBe('0x123');
      expect(json.from).toBe('0xuser1');
      expect(json.explorerUrl).toBeDefined();
    });
  });

  describe('Unit conversions', () => {
    test('should convert BDAG to Wei correctly', () => {
      const wei = toWei(1);
      expect(wei.toString()).toBe('1000000000000000000');
    });

    test('should convert Wei to BDAG correctly', () => {
      const bdag = fromWei('1000000000000000000');
      expect(bdag).toBe(1);
    });

    test('should handle decimal BDAG values', () => {
      const wei = toWei(0.5);
      expect(wei.toString()).toBe('500000000000000000');
    });

    test('should handle large BDAG values', () => {
      const wei = toWei(1000);
      expect(wei.toString()).toBe('1000000000000000000000');
    });
  });

  describe('Transaction creation functions', () => {
    let mockWeb3;

    beforeEach(() => {
      mockWeb3 = {};
      fetch.mockClear();
      localStorage.clear();
    });

    test('transferNFTInstant should create transaction', async () => {
      const tx = await transferNFTInstant(
        mockWeb3,
        '0xuser1',
        '0xuser2',
        '1',
        '0xcontract'
      );

      expect(tx).toBeInstanceOf(BlockDAGTransaction);
      expect(tx.type).toBe('nft_transfer');
      expect(tx.status).toBe('pending');
    });

    test('transferNFTInstant should throw if web3 not initialized', async () => {
      await expect(
        transferNFTInstant(null, '0xuser1', '0xuser2', '1', '0xcontract')
      ).rejects.toThrow('Web3 not initialized');
    });

    test('mintDynamicNFT should create mint transaction', async () => {
      const tx = await mintDynamicNFT(
        mockWeb3,
        '0xuser1',
        '0xcontract',
        { name: 'Test NFT' }
      );

      expect(tx).toBeInstanceOf(BlockDAGTransaction);
      expect(tx.type).toBe('nft_mint');
      expect(tx.metadata).toEqual({ name: 'Test NFT' });
    });

    test('mintDynamicNFT should throw if web3 not initialized', async () => {
      await expect(
        mintDynamicNFT(null, '0xuser1', '0xcontract')
      ).rejects.toThrow('Web3 not initialized');
    });

    test('transaction should auto-confirm after delay', async () => {
      const tx = await transferNFTInstant(
        mockWeb3,
        '0xuser1',
        '0xuser2',
        '1',
        '0xcontract'
      );

      expect(tx.status).toBe('pending');

      // Wait for auto-confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      expect(tx.status).toBe('confirmed');
      expect(tx.confirmations).toBe(1);
    });
  });

  describe('Network statistics', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    test('should handle network unavailability', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const stats = await getNetworkStats();
      expect(stats.networkStatus).toBe('unavailable');
      expect(stats.error).toBeDefined();
    });
  });

  describe('Error handling', () => {
    let mockWeb3;

    beforeEach(() => {
      mockWeb3 = {};
      localStorage.clear();
    });

    test('should handle transaction storage errors gracefully', async () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should not throw, just warn
      const tx = await transferNFTInstant(
        mockWeb3,
        '0xuser1',
        '0xuser2',
        '1',
        '0xcontract'
      );

      expect(tx).toBeInstanceOf(BlockDAGTransaction);

      // Restore
      localStorage.setItem = originalSetItem;
    });
  });
});
