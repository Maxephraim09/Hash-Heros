// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DynamicNFT is ERC721, Ownable {

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

    struct Meta { uint256 xp; uint256 level; string traits; }
    mapping(uint256 => Meta) public meta;
    uint256 public nextId;

    event Minted(uint256 indexed tokenId, address indexed owner);
    event MetadataUpdated(uint256 indexed tokenId, uint256 xp, uint256 level, string traits);

    constructor() ERC721("HashingHerosDynamic","HHD") {}

    function mint(address to) external onlyOwnerOrDemo returns (uint256) {
        nextId++;
        _safeMint(to, nextId);
        meta[nextId] = Meta({ xp:0, level:1, traits:"" });
        emit Minted(nextId, to);
        return nextId;
    }

    // Owner-only update for demo; replace with role-based logic for production
    function updateMetadata(uint256 tokenId, uint256 addXp, string calldata traits) external onlyOwnerOrDemo {
        Meta storage m = meta[tokenId];
        m.xp += addXp;
        m.level = (m.xp / 200) + 1; // level thresholds tuned for demo
        if (bytes(traits).length > 0) m.traits = traits;
        emit MetadataUpdated(tokenId, m.xp, m.level, m.traits);
    }

    function tokenMetadata(uint256 tokenId) external view returns (uint256 xp, uint256 level, string memory traits) {
        Meta memory m = meta[tokenId];
        return (m.xp, m.level, m.traits);
    }
}
