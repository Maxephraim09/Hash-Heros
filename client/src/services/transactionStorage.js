/**
 * Transaction Storage Service
 * Persists blockchain transactions to localStorage
 * Survives page reloads and browser restarts
 */

const STORAGE_KEY = 'hashing_heroes_transactions';
const MAX_TRANSACTIONS = 100;

export const transactionStorage = {
  /**
   * Save a transaction to persistent storage
   * @param {string} txHash - Transaction hash
   * @param {object} txData - Transaction data
   */
  saveTransaction: (txHash, txData) => {
    try {
      const transactions = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      
      // Check if transaction already exists
      const existingIndex = transactions.findIndex(tx => tx.hash === txHash);
      if (existingIndex >= 0) {
        // Update existing transaction
        transactions[existingIndex] = {
          ...transactions[existingIndex],
          ...txData,
          hash: txHash,
          updatedAt: Date.now()
        };
      } else {
        // Add new transaction
        transactions.push({
          hash: txHash,
          ...txData,
          timestamp: Date.now(),
          createdAt: Date.now()
        });
      }
      
      // Keep only latest MAX_TRANSACTIONS
      if (transactions.length > MAX_TRANSACTIONS) {
        transactions.splice(0, transactions.length - MAX_TRANSACTIONS);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      console.log(`[transactionStorage] Saved transaction: ${txHash}`);
      return true;
    } catch (error) {
      console.error('[transactionStorage] Save error:', error);
      return false;
    }
  },

  /**
   * Get all transactions from storage
   * @returns {array} Array of transactions
   */
  getTransactions: () => {
    try {
      const transactions = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      return transactions.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('[transactionStorage] Get error:', error);
      return [];
    }
  },

  /**
   * Get transactions for a specific user
   * @param {string} userAddress - User's wallet address
   * @returns {array} Array of user's transactions
   */
  getUserTransactions: (userAddress) => {
    try {
      const allTransactions = transactionStorage.getTransactions();
      if (!userAddress) return [];
      
      return allTransactions.filter(tx => {
        const fromMatch = tx.from && tx.from.toLowerCase() === userAddress.toLowerCase();
        const toMatch = tx.to && tx.to.toLowerCase() === userAddress.toLowerCase();
        return fromMatch || toMatch;
      });
    } catch (error) {
      console.error('[transactionStorage] Get user transactions error:', error);
      return [];
    }
  },

  /**
   * Get a specific transaction by hash
   * @param {string} txHash - Transaction hash
   * @returns {object} Transaction object or null
   */
  getTransaction: (txHash) => {
    try {
      const transactions = transactionStorage.getTransactions();
      return transactions.find(tx => tx.hash === txHash) || null;
    } catch (error) {
      console.error('[transactionStorage] Get transaction error:', error);
      return null;
    }
  },

  /**
   * Update transaction status
   * @param {string} txHash - Transaction hash
   * @param {string} status - New status
   * @param {object} additionalData - Additional data to update
   */
  updateTransactionStatus: (txHash, status, additionalData = {}) => {
    try {
      const transactions = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      
      const tx = transactions.find(t => t.hash === txHash);
      if (tx) {
        tx.status = status;
        tx.updatedAt = Date.now();
        Object.assign(tx, additionalData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        console.log(`[transactionStorage] Updated ${txHash} to ${status}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[transactionStorage] Update status error:', error);
      return false;
    }
  },

  /**
   * Delete a transaction from storage
   * @param {string} txHash - Transaction hash
   */
  deleteTransaction: (txHash) => {
    try {
      const transactions = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      
      const filtered = transactions.filter(tx => tx.hash !== txHash);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      console.log(`[transactionStorage] Deleted transaction: ${txHash}`);
      return true;
    } catch (error) {
      console.error('[transactionStorage] Delete error:', error);
      return false;
    }
  },

  /**
   * Clear all transactions from storage
   */
  clearTransactions: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('[transactionStorage] Cleared all transactions');
      return true;
    } catch (error) {
      console.error('[transactionStorage] Clear error:', error);
      return false;
    }
  },

  /**
   * Get transaction statistics
   * @returns {object} Statistics about stored transactions
   */
  getStats: () => {
    try {
      const transactions = transactionStorage.getTransactions();
      const confirmed = transactions.filter(t => t.status === 'confirmed').length;
      const pending = transactions.filter(t => t.status === 'pending').length;
      const failed = transactions.filter(t => t.status === 'failed').length;
      
      return {
        total: transactions.length,
        confirmed,
        pending,
        failed,
        oldestTimestamp: transactions.length > 0 ? transactions[transactions.length - 1].timestamp : null,
        newestTimestamp: transactions.length > 0 ? transactions[0].timestamp : null
      };
    } catch (error) {
      console.error('[transactionStorage] Get stats error:', error);
      return { total: 0, confirmed: 0, pending: 0, failed: 0 };
    }
  },

  /**
   * Export transactions as JSON
   * @returns {string} JSON string of all transactions
   */
  export: () => {
    try {
      const transactions = transactionStorage.getTransactions();
      return JSON.stringify(transactions, null, 2);
    } catch (error) {
      console.error('[transactionStorage] Export error:', error);
      return '[]';
    }
  },

  /**
   * Import transactions from JSON
   * @param {string} jsonString - JSON string of transactions
   */
  import: (jsonString) => {
    try {
      const transactions = JSON.parse(jsonString);
      if (Array.isArray(transactions)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        console.log(`[transactionStorage] Imported ${transactions.length} transactions`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[transactionStorage] Import error:', error);
      return false;
    }
  }
};

export default transactionStorage;
