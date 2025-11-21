import Web3 from 'web3';
import DynamicNFTJson from '../contracts/DynamicNFT.json';
import ReputationJson from '../contracts/ReputationNFT.json';
import UtilityJson from '../contracts/UtilityTicketNFT.json';
import FastTransferJson from '../contracts/FastTransfer.json';

let web3;

export async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return web3;
  } else {
    web3 = new Web3('http://127.0.0.1:7545');
    return web3;
  }
}

export async function loadContracts() {
  const netId = await web3.eth.net.getId();
  const load = (json) => (json.networks && json.networks[netId] ? new web3.eth.Contract(json.abi, json.networks[netId].address) : null);
  return {
    web3,
    DynamicNFT: load(DynamicNFTJson),
    Reputation: load(ReputationJson),
    Utility: load(UtilityJson),
    FastTransfer: load(FastTransferJson)
  };
}
