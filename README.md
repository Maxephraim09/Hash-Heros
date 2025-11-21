# Hashing Heros — BlockDAG Gamified NFT Demo (Wave 2)

Stack: React (UI) + Truffle (contracts) + Ganache (local blockchain) + BlockDAG-sim (mock) + Mock API.

This demo showcases:
- Dynamic evolving NFTs (XP-driven)
- Reputation NFTs (soulbound identity)
- Utility/Ticket NFTs
- AI metadata generator (mock)
- Instant transfers & micropayments via BlockDAG-sim
- Hamster-style gamification (Tap-to-Earn, Missions, Energy, Store)

## Quick start (summary)

1. Start Ganache (GUI or `ganache-cli -p 7545`).
2. Install truffle and deps:
   - `npm install -g truffle`
   - From project root: `npm install` (if root scripts exist)
3. Compile & migrate:
   - `truffle compile`
   - `truffle migrate --reset --network development`
4. Start BlockDAG simulator:
   - `cd blockdag-sim && npm install && npm start`
5. Start Mock API:
   - `cd mock-api && npm install && npm start`
6. Start React client:
   - `cd client && npm install`
   - Copy `build/contracts/*.json` from truffle build to `client/src/contracts/`
   - `npm start`
7. Open `http://localhost:3000` and connect MetaMask to Ganache.

## Wave-2 deliverables included
- GitHub repo link (this repo)
- Functional architecture (docs/architecture-diagram.png — create in your docs)
- Smart contract scaffolds (in /contracts)
- Mock BlockDAG backend (blockdag-sim/)
- Early UI wireframes/React demo (client/)
- README with tech stack & run instructions

## Notes
- For demo, owner-only functions (mint/update) use Ganache account[0]. Use that as owner in MetaMask for owner actions.
- BlockDAG-sim is a local mock to showcase instant confirms and micropayment flows; it is replaceable with a real BlockDAG node in future.


## Demo Mode

Set `REACT_APP_DEMO_MODE=true` in `client/.env` to enable demo-mode UI features. The contracts have been modified for demo mode (a `demoMode` flag and `onlyOwnerOrDemo` modifier) so owner-only functions can be called during your Wave-2 demo from any account. An Admin Panel is available in the UI to trigger metadata updates, reputation changes, ticket issuance and instant acknowledgements.
