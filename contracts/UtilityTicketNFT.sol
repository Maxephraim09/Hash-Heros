// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UtilityTicketNFT is ERC721, Ownable {

// ---- Demo mode helper (for Wave-2 demos) ----
bool public demoMode = true;

modifier onlyOwnerOrDemo() {
    if (!demoMode) {
        require(owner() == msg.sender, "Not owner");
    }
    _;
}

function setDemoMode(bool v) external onlyOwnerOrDemo {
    demoMode = v;
}
// ---------------------------------------------

    struct Ticket { uint256 validUntil; string meta; }
    mapping(uint256 => Ticket) public tickets;
    uint256 public nextId;

    event TicketIssued(uint256 indexed id, address indexed to, uint256 validUntil);

    constructor() ERC721("HashingHerosTicket","HHT") Ownable(msg.sender) {}

    function issueTicket(address to, uint256 daysValid, string calldata meta) external onlyOwnerOrDemo returns (uint256) {
        nextId++;
        _safeMint(to, nextId);
        tickets[nextId] = Ticket(block.timestamp + (daysValid * 1 days), meta);
        emit TicketIssued(nextId, to, tickets[nextId].validUntil);
        return nextId;
    }

    function isValid(uint256 tokenId) external view returns (bool) {
        return tickets[tokenId].validUntil >= block.timestamp;
    }

    function ticketMeta(uint256 tokenId) external view returns (string memory) {
        return tickets[tokenId].meta;
    }
}
