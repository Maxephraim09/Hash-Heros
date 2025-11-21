/**
 * Transaction Storage Tests
 * 
 * Tests for the transactionStorage.js service that handles
 * persistent transaction history using browser localStorage.
 */

import * as transactionStorage from '../transactionStorage';

// Mock localStorage
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

describe('transactionStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveTransaction', () => {
    test('should save a transaction to localStorage', () => {
      const tx = {
        hash: '0x123',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      };

      transactionStorage.saveTransaction(tx);
      const transactions = transactionStorage.getTransactions();

      expect(transactions).toHaveLength(1);
      expect(transactions[0].hash).toBe('0x123');
    });

    test('should not save duplicate transactions', () => {
      const tx = {
        hash: '0x123',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      };

      transactionStorage.saveTransaction(tx);
      transactionStorage.saveTransaction(tx);
      const transactions = transactionStorage.getTransactions();

      expect(transactions).toHaveLength(1);
    });

    test('should enforce max transaction limit', () => {
      // Add more than max transactions
      for (let i = 0; i < 110; i++) {
        transactionStorage.saveTransaction({
          hash: `0x${i}`,
          from: `0xuser${i}`,
          to: `0xuser${i + 1}`,
          value: '1',
          type: 'transfer',
          status: 'pending'
        });
      }

      const transactions = transactionStorage.getTransactions();
      expect(transactions.length).toBeLessThanOrEqual(100);
    });
  });

  describe('getTransactions', () => {
    test('should return all transactions sorted by timestamp', () => {
      transactionStorage.saveTransaction({
        hash: '0x1',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      });

      transactionStorage.saveTransaction({
        hash: '0x2',
        from: '0xuser1',
        to: '0xuser2',
        value: '200',
        type: 'transfer',
        status: 'pending'
      });

      const transactions = transactionStorage.getTransactions();
      expect(transactions).toHaveLength(2);
      // Most recent first
      expect(transactions[0].hash).toBe('0x2');
    });

    test('should return empty array if no transactions', () => {
      const transactions = transactionStorage.getTransactions();
      expect(transactions).toEqual([]);
    });
  });

  describe('getUserTransactions', () => {
    test('should return transactions for specific user', () => {
      transactionStorage.saveTransaction({
        hash: '0x1',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      });

      transactionStorage.saveTransaction({
        hash: '0x2',
        from: '0xuser3',
        to: '0xuser4',
        value: '200',
        type: 'transfer',
        status: 'pending'
      });

      const userTxs = transactionStorage.getUserTransactions('0xuser1');
      expect(userTxs).toHaveLength(1);
      expect(userTxs[0].hash).toBe('0x1');
    });

    test('should include transactions where user is sender or receiver', () => {
      transactionStorage.saveTransaction({
        hash: '0x1',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      });

      transactionStorage.saveTransaction({
        hash: '0x2',
        from: '0xuser3',
        to: '0xuser1',
        value: '200',
        type: 'transfer',
        status: 'pending'
      });

      const userTxs = transactionStorage.getUserTransactions('0xuser1');
      expect(userTxs).toHaveLength(2);
    });
  });

  describe('updateTransactionStatus', () => {
    test('should update transaction status', () => {
      transactionStorage.saveTransaction({
        hash: '0x123',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      });

      transactionStorage.updateTransactionStatus('0x123', 'confirmed');
      const tx = transactionStorage.getTransaction('0x123');

      expect(tx.status).toBe('confirmed');
    });

    test('should handle non-existent transaction', () => {
      const result = transactionStorage.updateTransactionStatus('0xnonexistent', 'confirmed');
      expect(result).toBeFalsy();
    });
  });

  describe('deleteTransaction', () => {
    test('should delete a transaction', () => {
      transactionStorage.saveTransaction({
        hash: '0x123',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      });

      transactionStorage.deleteTransaction('0x123');
      const tx = transactionStorage.getTransaction('0x123');

      expect(tx).toBeUndefined();
    });
  });

  describe('getStats', () => {
    test('should return transaction statistics', () => {
      transactionStorage.saveTransaction({
        hash: '0x1',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'confirmed'
      });

      transactionStorage.saveTransaction({
        hash: '0x2',
        from: '0xuser1',
        to: '0xuser2',
        value: '200',
        type: 'transfer',
        status: 'pending'
      });

      const stats = transactionStorage.getStats();

      expect(stats.total).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.confirmed).toBe(1);
    });
  });

  describe('export and import', () => {
    test('should export and import transactions', () => {
      const originalTx = {
        hash: '0x123',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      };

      transactionStorage.saveTransaction(originalTx);
      const exported = transactionStorage.export();
      
      localStorage.clear();
      transactionStorage.import(exported);

      const tx = transactionStorage.getTransaction('0x123');
      expect(tx.hash).toBe('0x123');
      expect(tx.from).toBe('0xuser1');
    });
  });

  describe('clearTransactions', () => {
    test('should clear all transactions', () => {
      transactionStorage.saveTransaction({
        hash: '0x1',
        from: '0xuser1',
        to: '0xuser2',
        value: '100',
        type: 'transfer',
        status: 'pending'
      });

      transactionStorage.clearTransactions();
      const transactions = transactionStorage.getTransactions();

      expect(transactions).toHaveLength(0);
    });
  });
});
