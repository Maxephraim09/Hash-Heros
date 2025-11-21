# Hashing Heros — Dynamic NFT Network Platform

A comprehensive NFT network platform built on blockchain technology that combines dynamic NFTs, reputation systems, and gamified mechanics inspired by play-to-earn games. This demo showcases next-generation blockchain integration with fast transaction speeds via BlockDAG technology.

---

## 🎮 Project Overview

**Hashing Heros** is a decentralized gaming platform that enables users to mint, evolve, and trade NFTs while participating in engaging game mechanics. The platform leverages Solidity smart contracts deployed on Ethereum-compatible blockchains and integrates with BlockDAG technology for instant transaction confirmation and micropayments.

### Key Highlights
- **Dynamic NFTs**: Evolving avatars that gain experience points (XP) and level up
- **Reputation System**: Soulbound NFTs tracking user credibility and achievements
- **Utility Tickets**: Time-bound NFT tickets for in-game rewards and access
- **Instant Transfers**: Near-instant transaction confirmation via BlockDAG simulation
- **Gamification**: Tap-to-earn mechanics, missions, energy management, and reward stores
- **AI-Enhanced Metadata**: Mock AI generator for dynamic NFT traits and descriptions

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Blockchain** | Solidity 0.8.20 + OpenZeppelin | Smart contracts & NFT standards |
| **Dev Framework** | Truffle | Contract compilation & migration |
| **Local Chain** | Ganache | Local blockchain simulation |
| **Fast Layer** | BlockDAG-sim (Node.js Express) | Instant transfers & micropayments |
| **Backend API** | Mock API (Node.js Express) | NFT metadata & game state management |
| **Frontend** | React.js + Web3.js | User interface & wallet integration |
| **Wallet** | MetaMask | User account & transaction signing |

### Project Structure

```
Hash-Heros/
├── contracts/                 # Solidity smart contracts
│   ├── DynamicNFT.sol        # Evolving NFTs with XP system
│   ├── ReputationNFT.sol     # Soulbound reputation badges
│   ├── UtilityTicketNFT.sol  # Time-bound utility tickets
│   └── FastTransfer.sol      # BlockDAG instant transfer acknowledgment
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Game UI components
│   │   ├── context/          # React game state (GameContext)
│   │   ├── services/         # Web3 & API integrations
│   │   └── contracts/        # ABI JSONs from truffle build
│   └── public/               # Static assets
├── blockdag-sim/             # BlockDAG mock server (instant transfers)
├── mock-api/                 # Game state API backend
└── migrations/               # Truffle deployment scripts
```

---

## 📋 Smart Contracts

### 1. **DynamicNFT.sol** - Evolving Heroes
- **Purpose**: Core collectible NFT that evolves based on gameplay
- **Key Features**:
  - Mint NFTs with initial metadata (level 1, 0 XP)
  - Update XP through gameplay (missions, tapping)
  - Auto-calculate level from XP (formula: `level = floor(xp / 200) + 1`)
  - Dynamic trait storage for AI-generated descriptions
- **Key Functions**:
  - `mint(address to)`: Create a new hero NFT
  - `updateMetadata(uint256 tokenId, uint256 addXp, string traits)`: Gain XP & update traits
  - `tokenMetadata(uint256 tokenId)`: Read current XP, level, and traits

### 2. **ReputationNFT.sol** - Identity Badges
- **Purpose**: Soulbound tokens representing user credibility and achievements
- **Key Features**:
  - One reputation NFT per user address
  - Non-transferable soulbound tokens
  - Reputation score tracking (additive only)
- **Key Functions**:
  - `mintIdentity(address to)`: Issue soulbound badge to user
  - `addReputation(address user, uint256 delta)`: Increase reputation score
  - `getReputation(address user)`: Query user's reputation

### 3. **UtilityTicketNFT.sol** - In-Game Tickets
- **Purpose**: Time-bound NFTs granting access or rewards
- **Key Features**:
  - Configurable expiration dates
  - Metadata storage for ticket type/description
  - Validity checker for game logic
- **Key Functions**:
  - `issueTicket(address to, uint256 daysValid, string meta)`: Create time-bound ticket
  - `isValid(uint256 tokenId)`: Check if ticket is still valid
  - `ticketMeta(uint256 tokenId)`: Read ticket metadata

### 4. **FastTransfer.sol** - BlockDAG Integration
- **Purpose**: Simulates instant transfer acknowledgment via BlockDAG
- **Key Features**:
  - Event-driven transfer logging
  - No state changes (stateless acknowledgment)
  - Placeholder for real BlockDAG integration
- **Key Functions**:
  - `instantAcknowledge(address from, address to, uint256 tokenId)`: Log instant transfer

---

## 🎮 Frontend Components

### UI Components (`client/src/components/`)

1. **TapToEarn.js** - Hamster-style clicking mechanic
   - Click to earn XP
   - Energy system (regenerates over time)
   - Real-time XP accumulation

2. **NFT_Evolution.js** - Hero progression display
   - Shows current hero stats (level, XP)
   - Visual level-up indicators
   - Trait display

3. **ReputationBadge.js** - User reputation system
   - Display user reputation score
   - Milestone badges
   - Achievement tracking

4. **AIGenerator.js** - Dynamic trait generation
   - Mock AI for generating hero descriptions
   - Trait suggestions based on gameplay
   - Visual trait rendering

5. **InstantTransfer.js** - P2P NFT transfers
   - Send heroes to other wallets
   - BlockDAG instant confirmation display
   - Transfer receipts & history

6. **Missions.js** - Quest system
   - Daily/weekly missions
   - Reward claims
   - Mission progress tracking

7. **AdminPanel.js** - Owner management
   - Mint new NFTs for testing
   - Update metadata for demo
   - Issue tickets & reputation changes
   - Toggle demo mode

### Game State Management (`context/GameState.js`)
- Centralized React Context for game state
- Reducer pattern for state updates
- Tracks: XP, level, energy, reputation, badges

---

## 🚀 Backend Services

### BlockDAG Simulator (`blockdag-sim/server.js`)
Simulates instant transaction confirmation without finality delays.

**Endpoints**:
- `POST /transfer` - Acknowledge instant NFT transfer with receipt
- `POST /micropay` - Record micropayment transaction
- `GET /micropay/:address` - Query user's micropayment balance
- `GET /receipts` - Retrieve all confirmed transfers

**Features**:
- 50ms confirmation simulation
- Receipt generation with timestamps
- Micropayment balance tracking

### Mock API (`mock-api/server.js`)
Provides game state and NFT metadata persistence.

**Endpoints**:
- `GET /nft/:id` - Retrieve NFT metadata
- `POST /nft/:id/update` - Update XP and traits

**Features**:
- In-memory data store (easily swappable with database)
- XP-to-level calculation
- Trait persistence

---

## 🎯 Core Features Implemented

### 1. **Dynamic NFT Evolution**
```
User taps → Earns XP → NFT gains experience → Auto-level up
Level = floor(XP / 200) + 1
```

### 2. **Reputation Tracking**
```
Achievements → Admin awards reputation → Soulbound badge issued
Users accumulate reputation for unlocking features
```

### 3. **Instant Transfers**
```
Initiate transfer → BlockDAG confirms in ~50ms → Receipt generated
Decoupled from blockchain finality
```

### 4. **Gamification Mechanics**
- **Energy System**: Limited taps per session, regenerates over time
- **Missions**: Quests with XP rewards
- **Shop**: Spend earned rewards on in-game items
- **Leaderboards**: Reputation-based rankings

### 5. **Demo Mode**
- All owner-only functions callable by any account
- Easy testing without account switching
- Toggle via `demoMode` flag in contracts

---

## ⚡ How to Get Started

### Quick Start (5 Minutes)

If you want to see the project running **immediately** without understanding all the details:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Maxephraim09/Hash-Heros.git
   cd Hash-Heros
   ```

2. **Start Ganache** (blockchain simulator)
   ```bash
   ganache-cli -p 7545
   ```
   Keep this terminal open.

3. **In a new terminal, deploy contracts**
   ```bash
   npm install -g truffle
   truffle compile
   truffle migrate --reset --network development
   ```

4. **In a new terminal, start the backend services**
   ```bash
   # Start BlockDAG simulator
   cd blockdag-sim
   npm install
   npm start
   ```
   Keep this running (runs on port 4001).

5. **In another terminal, start the mock API**
   ```bash
   cd mock-api
   npm install
   npm start
   ```
   Keep this running (runs on port 4002).

6. **In another terminal, start the React app**
   ```bash
   cd client
   npm install
   cp ../build/contracts/*.json src/contracts/
   npm start
   ```
   App opens at `http://localhost:3000`

7. **Connect MetaMask**
   - Add Ganache network (RPC: `http://127.0.0.1:7545`, Chain ID: `5777`)
   - Import a Ganache test account (private key from Ganache)
   - You're ready to play!

### What to Do First

Once everything is running:
1. Open the **Admin Panel** in the UI
2. Click **"Mint Hero"** to create your first NFT hero
3. Click the **main hero section** to start tapping and earning XP
4. Watch your hero **level up** as you gain XP
5. Complete **Missions** to earn extra rewards
6. Try **Instant Transfer** to send your hero to another wallet

---

## 📚 Understanding the Project

### For Complete Beginners
- **New to Web3?** Check out the [Project Overview](#-project-overview) section
- **Want to understand contracts?** Read [Smart Contracts](#-smart-contracts) section
- **Curious about architecture?** See [Architecture](#-architecture)

### For Experienced Developers
- Jump to [Backend Services](#-backend-services) for API details
- See [API Reference](#-api-reference) for implementation details
- Check [Security Considerations](#-security-considerations) for production notes

### For Project Managers/Business
- Review [Future Features & Roadmap](#-future-features--roadmap) for vision
- See [Scalability Roadmap](#-scalability-roadmap) for growth strategy
- Check [FAQ](#-faq) for common questions

---

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** v14+ and npm
- **Ganache CLI** or Ganache GUI
- **MetaMask** browser extension
- **Truffle** globally installed

### Step-by-Step Setup

#### 1. Initialize Ganache
```bash
ganache-cli -p 7545
# Or use Ganache GUI and ensure it runs on port 7545
```

#### 2. Deploy Smart Contracts
```bash
npm install -g truffle
truffle compile
truffle migrate --reset --network development
```

#### 3. Start BlockDAG Simulator
```bash
cd blockdag-sim
npm install
npm start
# Runs on http://localhost:4001
```

#### 4. Start Mock API
```bash
cd mock-api
npm install
npm start
# Runs on http://localhost:4002
```

#### 5. Deploy React Frontend
```bash
cd client
npm install

# Copy contract ABIs
cp ../build/contracts/*.json src/contracts/

# Start development server
npm start
# Opens on http://localhost:3000
```

#### 6. Connect MetaMask
1. Add Ganache network to MetaMask:
   - Network Name: Ganache
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `5777`
   - Currency: ETH
2. Import Ganache test account (copy private key from Ganache)
3. Ensure wallet is connected to Ganache network

#### 7. Enable Demo Mode (Optional)
Create `.env` in `client/` directory:
```
REACT_APP_DEMO_MODE=true
```

---

## 📖 Usage Guide

### For Players
1. **Create Hero**: Click "Mint Hero" in AdminPanel (demo mode)
2. **Tap to Earn**: Click rapidly to gain XP
3. **Watch Evolution**: Monitor XP → Level progression
4. **Complete Missions**: Earn extra rewards
5. **Transfer Heroes**: Send NFTs to friends
6. **Earn Reputation**: Unlock achievements

### For Developers/Admins
1. **Update Metadata**: AdminPanel → Update XP/Traits
2. **Issue Tickets**: AdminPanel → Create utility tickets
3. **Award Reputation**: AdminPanel → Increase reputation
4. **Toggle Demo Mode**: `setDemoMode(bool)` on contracts

---

## 🔮 Future Features & Roadmap

### Phase 2: Enhanced Gameplay
- [ ] **Breeding System**: Combine two heroes to create offspring
- [ ] **Marketplace**: Peer-to-peer NFT trading with price discovery
- [ ] **Staking Rewards**: Earn passive income by staking NFTs
- [ ] **PvP Battles**: Hero vs Hero combat with XP rewards

### Phase 3: Advanced Economics
- [ ] **Governance Token**: $HERO token for voting & staking
- [ ] **Fractional Ownership**: Own a percentage of rare NFTs
- [ ] **Seasonal Passes**: Premium battle pass with exclusive rewards
- [ ] **Cross-Chain Bridging**: Trade heroes across different blockchains

### Phase 4: AI & Personalization
- [ ] **Real AI Integration**: GPT-based trait generation
- [ ] **Dynamic Storytelling**: Narrative quests tied to NFT properties
- [ ] **Recommendation Engine**: Suggest optimal hero combinations
- [ ] **Procedural Quest Generation**: Infinite unique missions

### Phase 5: Social & Community
- [ ] **Guilds/Teams**: Cooperative gameplay with shared treasuries
- [ ] **Social Dashboard**: Follow friends & track their progress
- [ ] **In-Game Chat**: Built-in messaging system
- [ ] **NFT Renting**: Temporary NFT borrowing with split rewards

---

## 📈 Scalability Roadmap

### Current Bottlenecks (Development Phase)
- **Ganache**: Single-machine blockchain (no real consensus)
- **In-Memory Storage**: Mock API loses data on restart
- **No Database**: No persistent data layer

### Phase 1: Production Readiness
| Challenge | Solution |
|-----------|----------|
| **Smart Contract Scaling** | Implement ERC721A (batch minting), lazy evaluation of metadata |
| **Transaction Speed** | Deploy to actual BlockDAG network (Kaspa, Allnodes) |
| **Data Persistence** | Migrate to MongoDB/PostgreSQL + IPFS for metadata URIs |
| **API Load** | Implement caching layer (Redis), pagination, rate limiting |

### Phase 2: Blockchain Optimization
- **Layer 2 Solutions**: Implement Polygon/Arbitrum for cheaper transactions
- **Account Abstraction**: Enable gasless transactions for users
- **Batch Processing**: Group multiple player actions into single transaction
- **Compression**: Use sparse merkle trees to reduce state size

### Phase 3: Infrastructure Scaling
- **Distributed Backend**: Multi-region API servers with load balancing
- **Event Indexing**: The Graph for real-time contract event processing
- **CDN**: CloudFlare for static assets & metadata delivery
- **Sharding**: Partition player base across multiple contract instances

### Phase 4: Advanced Scaling
- **Rollups**: Custom zk-SNARK or Optimistic Rollup for 1000x throughput
- **Side Chains**: Independent chains for mini-games, settled on mainnet
- **State Channels**: Off-chain gameplay with periodic on-chain settlements
- **Oracles**: Chainlink for external data feeds (prices, randomness)

### Performance Targets
| Metric | Current | Target |
|--------|---------|--------|
| **Tx Confirmation** | 2-15s (Ganache) | <1s (BlockDAG) |
| **Max TPS** | ~100 (Ganache) | 10,000+ (Polygon/BlockDAG) |
| **User Capacity** | 100s | 1,000,000+ |
| **API Response Time** | <100ms | <50ms (p99) |
| **Data Consistency** | In-memory | Replicated DB |

---

## 🔐 Security Considerations

### Current Implementation
- ✅ OpenZeppelin ERC721 standard library
- ✅ Owner-based access control
- ✅ Demo mode for development
- ⚠️ No reentrancy guards (non-critical for NFT contracts)

### Production Checklist
- [ ] Formal security audit by third-party firm
- [ ] Role-based access control (RBAC) instead of single owner
- [ ] Time locks for critical functions
- [ ] Multi-signature wallet for owner operations
- [ ] Pause mechanisms for emergency halts
- [ ] Comprehensive test suite (>90% coverage)
- [ ] Real BlockDAG integration for finality guarantees

---

## 📊 API Reference

### Web3 Service (`client/src/services/web3Service.js`)
```javascript
initWeb3()                    // Initialize Web3 with MetaMask or Ganache
loadContracts()               // Load all contract instances
```

### BlockDAG Service (`client/src/services/blockdagService.js`)
```javascript
instantTransfer(from, to, tokenId)   // Acknowledge instant transfer
micropay(address, amount)             // Record micropayment
getMicro(address)                     // Query user's balance
```

### Smart Contract ABI Examples
See `client/src/contracts/` for full ABIs.

---

## 🤝 Contributing

We welcome contributions! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Tips
- Update `DynamicNFT.sol` for new NFT mechanics
- Extend `GameState.js` for new game state
- Add UI components in `client/src/components/`
- Test with `truffle test` before submitting PR

---

## 📝 License

This project is licensed under the **MIT License** — see `LICENSE` file for details.

---

## 🌐 Links & Resources

- **BlockDAG Technology**: [Learn about BlockDAG vs Blockchain](https://blockdag.network)
- **OpenZeppelin Contracts**: [ERC721 Documentation](https://docs.openzeppelin.com/contracts/4.x/erc721)
- **Web3.js**: [Official Documentation](https://web3js.readthedocs.io/)
- **Solidity**: [Language Documentation](https://docs.soliditylang.org/)
- **Ganache**: [Local Development Guide](https://www.trufflesuite.com/ganache)

---

## 💡 FAQ

**Q: Can I deploy this to mainnet?**
A: Not recommended without audits and production hardening. Use testnet (Sepolia/Goerli) first.

**Q: How do I add new NFT types?**
A: Create a new ERC721 contract following the DynamicNFT pattern, then add loaders in `web3Service.js`.

**Q: How do I enable real micropayments?**
A: Replace BlockDAG-sim with actual Kaspa node RPC, or use a Layer 2 solution like Polygon.

**Q: Is demo mode production-safe?**
A: No. Demo mode bypasses owner checks. Disable for mainnet: `setDemoMode(false)`.

**Q: How do I scale to millions of users?**
A: See "Scalability Roadmap" section above. Start with Layer 2 + distributed backend.

---

## 🎉 Acknowledgments

Built with ❤️ using Truffle, React, and OpenZeppelin.

**Last Updated**: November 2025
**Version**: Wave 2.0 Demo
**Maintainer**: Maxephraim09
