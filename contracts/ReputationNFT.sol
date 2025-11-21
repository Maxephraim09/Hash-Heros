// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationNFT is ERC721, Ownable {

// ---- Demo mode helper (for Wave-2 demos) ----
bool public demoMode = true;

modifier onlyOwnerOrDemoOrDemo() {
    if (!demoMode) {
        require(owner() == msg.sender, "Not owner");
    }
    _;
}

function setDemoMode(bool v) external onlyOwnerOrDemo {
    demoMode = v;
}
// ---------------------------------------------

    mapping(address => uint256) public reputation;
    uint256 public nextId;

    event ReputationChanged(address indexed user, uint256 newScore);
    event IdentityMinted(uint256 indexed id, address indexed to);

    constructor() ERC721("HashingHerosRep","HHR") {}

    function mintIdentity(address to) external onlyOwnerOrDemo returns (uint256) {
        nextId++;
        _safeMint(to, nextId);
        reputation[to] = 0;
        emit IdentityMinted(nextId, to);
        return nextId;
    }

    function addReputation(address user, uint256 delta) external onlyOwnerOrDemo {
        reputation[user] += delta;
        emit ReputationChanged(user, reputation[user]);
    }

    function getReputation(address user) external view returns (uint256) {
        return reputation[user];
    }
}
