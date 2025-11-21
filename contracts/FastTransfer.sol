// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FastTransfer is Ownable {

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

    event FastSent(address indexed from, address indexed to, uint256 tokenId, uint256 timestamp);

    function instantAcknowledge(address from, address to, uint256 tokenId) external {
        emit FastSent(from, to, tokenId, block.timestamp);
    }
}
