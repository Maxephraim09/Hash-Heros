import Web3 from 'web3';
import DynamicNFTJson from '../contracts/DynamicNFT.json';
import ReputationJson from '../contracts/ReputationNFT.json';
import UtilityJson from '../contracts/UtilityTicketNFT.json';
import FastTransferJson from '../contracts/FastTransfer.json';

let web3;
let currentAccount = null;
let isBlockDAG = false;

// BlockDAG Awakening Testnet Configuration
const BLOCKDAG_CONFIG = {
  chainId: '0x40b', // 1043 in hex
  chainName: 'BlockDAG Awakening Testnet',
  rpcUrls: ['https://rpc.awakening.bdagscan.com'],
  blockExplorerUrls: ['https://awakening.bdagscan.com'],
  nativeCurrency: { name: 'BDAG', symbol: 'BDAG', decimals: 18 }
};

export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected. Please install MetaMask.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];

    // Initialize Web3 with MetaMask provider
    web3 = new Web3(window.ethereum);

    // Check and switch to BlockDAG network
    try {
      const chainId = await web3.eth.getChainId();
      if (chainId.toString() !== '1043') {
        // Try to switch to BlockDAG network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BLOCKDAG_CONFIG.chainId }]
          });
        } catch (switchError) {
          // Network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [BLOCKDAG_CONFIG]
            });
          } else {
            throw switchError;
          }
        }
      }
      isBlockDAG = true;
    } catch (networkError) {
      console.warn('BlockDAG network switch failed:', networkError);
      isBlockDAG = false;
    }

    return { account: currentAccount, isBlockDAG };
  } catch (error) {
    throw new Error('Failed to connect MetaMask: ' + error.message);
  }
}

export async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        return web3;
      }
    } catch (error) {
      console.warn('Could not get accounts from MetaMask:', error);
    }
  }
  
  // Fallback to BlockDAG RPC
  web3 = new Web3(BLOCKDAG_CONFIG.rpcUrls[0]);
  isBlockDAG = true;
  return web3;
}

export async function loadContracts() {
  const netId = await web3.eth.getChainId();
  const load = (json) => {
    // For demo mode, we'll use placeholder contracts on BlockDAG
    // In production, these would be deployed on BlockDAG testnet
    if (json.networks && json.networks[netId]) {
      return new web3.eth.Contract(json.abi, json.networks[netId].address);
    }
    return null;
  };

  return {
    web3,
    DynamicNFT: load(DynamicNFTJson),
    Reputation: load(ReputationJson),
    Utility: load(UtilityJson),
    FastTransfer: load(FastTransferJson),
    currentAccount,
    isBlockDAG
  };
}

export async function getBalance(address) {
  if (!web3) throw new Error('Web3 not initialized');
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, 'ether');
}

export async function getTransaction(txHash) {
  if (!web3) throw new Error('Web3 not initialized');
  return await web3.eth.getTransaction(txHash);
}

export async function waitForTransaction(txHash, maxAttempts = 30) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (receipt) return receipt;
    } catch (error) {
      console.warn('Transaction not yet confirmed:', error);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  throw new Error('Transaction confirmation timeout');
}

export function getCurrentAccount() {
  return currentAccount;
}

export function isBlockDAGNetwork() {
  return isBlockDAG;
}
