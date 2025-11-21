const DynamicNFT = artifacts.require("DynamicNFT");
const ReputationNFT = artifacts.require("ReputationNFT");
const UtilityTicketNFT = artifacts.require("UtilityTicketNFT");
const FastTransfer = artifacts.require("FastTransfer");

module.exports = async function(deployer) {
  await deployer.deploy(DynamicNFT);
  await deployer.deploy(ReputationNFT);
  await deployer.deploy(UtilityTicketNFT);
  await deployer.deploy(FastTransfer);
};
