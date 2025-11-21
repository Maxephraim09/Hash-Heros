/**
 * Smart Contract Deployment Script
 * 
 * Deploys all Hash-Heros smart contracts to the configured blockchain:
 * - DynamicNFT: Main NFT contract with evolution mechanics
 * - ReputationNFT: On-chain reputation/badge system
 * - UtilityTicketNFT: Ticket/utility token contract
 * - FastTransfer: Instant transfer capability contract
 * 
 * Usage:
 *   truffle migrate                              (Deploy to development)
 *   truffle migrate --network blockdag_awakening (Deploy to BlockDAG testnet)
 * 
 * After deployment, update client/.env with the new contract addresses:
 *   REACT_APP_DYNAMIC_NFT_ADDRESS
 *   REACT_APP_REPUTATION_NFT_ADDRESS
 *   REACT_APP_FAST_TRANSFER_ADDRESS
 *   REACT_APP_UTILITY_TICKET_ADDRESS
 */

const DynamicNFT = artifacts.require("DynamicNFT");
const ReputationNFT = artifacts.require("ReputationNFT");
const UtilityTicketNFT = artifacts.require("UtilityTicketNFT");
const FastTransfer = artifacts.require("FastTransfer");

module.exports = async function(deployer, network, accounts) {
  const deployerAccount = accounts[0];
  
  console.log('\n=== Hash-Heros Smart Contract Deployment ===');
  console.log(`Network: ${network}`);
  console.log(`Deployer: ${deployerAccount}\n`);

  try {
    // Deploy DynamicNFT
    console.log('📦 Deploying DynamicNFT...');
    await deployer.deploy(DynamicNFT);
    const dynamicNFT = await DynamicNFT.deployed();
    console.log(`✅ DynamicNFT deployed at: ${dynamicNFT.address}`);

    // Deploy ReputationNFT
    console.log('\n📦 Deploying ReputationNFT...');
    await deployer.deploy(ReputationNFT);
    const reputationNFT = await ReputationNFT.deployed();
    console.log(`✅ ReputationNFT deployed at: ${reputationNFT.address}`);

    // Deploy UtilityTicketNFT
    console.log('\n📦 Deploying UtilityTicketNFT...');
    await deployer.deploy(UtilityTicketNFT);
    const utilityTicket = await UtilityTicketNFT.deployed();
    console.log(`✅ UtilityTicketNFT deployed at: ${utilityTicket.address}`);

    // Deploy FastTransfer
    console.log('\n📦 Deploying FastTransfer...');
    await deployer.deploy(FastTransfer);
    const fastTransfer = await FastTransfer.deployed();
    console.log(`✅ FastTransfer deployed at: ${fastTransfer.address}`);

    // Summary
    console.log('\n=== Deployment Complete ===');
    console.log('\n📝 Update your client/.env file with these addresses:');
    console.log(`REACT_APP_DYNAMIC_NFT_ADDRESS=${dynamicNFT.address}`);
    console.log(`REACT_APP_REPUTATION_NFT_ADDRESS=${reputationNFT.address}`);
    console.log(`REACT_APP_UTILITY_TICKET_ADDRESS=${utilityTicket.address}`);
    console.log(`REACT_APP_FAST_TRANSFER_ADDRESS=${fastTransfer.address}`);
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    throw error;
  }
};
