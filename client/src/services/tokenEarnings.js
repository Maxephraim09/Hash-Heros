import { SimpleCache } from '../utils/optimizations';

const tokenCache = new SimpleCache(5 * 60 * 1000);

/**
 * BDAG Token Earning System
 * Tracks token rewards from various activities
 */

export class TokenEarnings {
  constructor(address) {
    this.address = address;
    this.totalEarned = 0;
    this.pendingBalance = 0;
    this.claimedBalance = 0;
    this.earnings = [];
    this.lastClaimTime = null;
  }

  addEarning(amount, source, description = '') {
    const earning = {
      id: Date.now(),
      amount,
      source,
      description,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    this.earnings.push(earning);
    this.totalEarned += amount;
    this.pendingBalance += amount;
    return earning;
  }

  claimEarnings() {
    const claimAmount = this.pendingBalance;
    if (claimAmount <= 0) return null;

    this.pendingBalance = 0;
    this.claimedBalance += claimAmount;
    this.lastClaimTime = new Date().toISOString();

    // Mark all pending earnings as claimed
    this.earnings.forEach(e => {
      if (e.status === 'pending') e.status = 'claimed';
    });

    return {
      amount: claimAmount,
      timestamp: this.lastClaimTime,
      txHash: generateClaimHash()
    };
  }

  getEarningBreakdown() {
    const breakdown = {};
    this.earnings.forEach(e => {
      if (!breakdown[e.source]) {
        breakdown[e.source] = { count: 0, total: 0 };
      }
      breakdown[e.source].count++;
      breakdown[e.source].total += e.amount;
    });
    return breakdown;
  }

  toJSON() {
    return {
      address: this.address,
      totalEarned: this.totalEarned,
      pendingBalance: this.pendingBalance,
      claimedBalance: this.claimedBalance,
      earnings: this.earnings,
      lastClaimTime: this.lastClaimTime,
      breakdown: this.getEarningBreakdown()
    };
  }
}

const userEarnings = {};

/**
 * Initialize or get token earnings tracker for user
 */
export function getOrCreateTokenEarnings(address) {
  if (!userEarnings[address]) {
    userEarnings[address] = new TokenEarnings(address);
  }
  return userEarnings[address];
}

/**
 * Earn tokens from tapping
 * Base: 0.001 BDAG per tap
 * Multiplier: level-based
 */
export function earnFromTapping(address, level = 1, taps = 1) {
  const baseReward = 0.001; // BDAG
  const multiplier = 1 + (level - 1) * 0.1; // 10% bonus per level
  const totalReward = baseReward * taps * multiplier;

  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    totalReward,
    'tap_to_earn',
    `Earned from ${taps} taps at level ${level}`
  );
}

/**
 * Earn tokens from NFT evolution
 * Reward: 0.1 BDAG per evolution
 */
export function earnFromNFTEvolution(address, nftLevel = 1) {
  const baseReward = 0.1; // BDAG
  const levelBonus = nftLevel * 0.05; // 5% bonus per NFT level
  const totalReward = baseReward + levelBonus;

  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    totalReward,
    'nft_evolution',
    `NFT evolved to level ${nftLevel}`
  );
}

/**
 * Earn tokens from NFT transfers
 * Reward: 0.05 BDAG per transfer (demonstrates micropayment speed)
 */
export function earnFromTransfer(address, nftId = 1) {
  const baseReward = 0.05; // BDAG
  
  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    baseReward,
    'instant_transfer',
    `Instant transfer of NFT #${nftId} on BlockDAG`
  );
}

/**
 * Earn tokens from reputation gains
 * Reward: 0.02 BDAG per reputation point
 */
export function earnFromReputation(address, repPoints = 1) {
  const baseReward = 0.02; // BDAG per rep point
  const totalReward = baseReward * repPoints;

  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    totalReward,
    'reputation',
    `Reputation increased by ${repPoints} points`
  );
}

/**
 * Earn tokens from completing missions
 * Reward: 0.2 - 1.0 BDAG depending on difficulty
 */
export function earnFromMission(address, missionId, difficulty = 'normal') {
  const difficultyRewards = {
    'easy': 0.2,
    'normal': 0.5,
    'hard': 1.0,
    'legendary': 2.5
  };

  const reward = difficultyRewards[difficulty] || 0.5;

  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    reward,
    'mission',
    `Completed ${difficulty} mission #${missionId}`
  );
}

/**
 * Earn tokens from daily login streak
 * Reward: 0.1 BDAG per day (multiplies with consecutive days)
 */
export function earnFromDailyLogin(address, consecutiveDays = 1) {
  const baseReward = 0.1; // BDAG
  const streakBonus = consecutiveDays * 0.05; // 5% bonus per consecutive day
  const totalReward = baseReward + streakBonus;

  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    totalReward,
    'daily_login',
    `Daily login streak: ${consecutiveDays} days`
  );
}

/**
 * Earn tokens from NFT sales/trades
 * Reward: 0.5% of sale value in BDAG (anti-inflation)
 */
export function earnFromNFTSale(address, saleValue = 1) {
  const reward = saleValue * 0.005; // 0.5% fee rewarded to platform
  
  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    reward,
    'nft_sale',
    `Traded NFT for ${saleValue} BDAG`
  );
}

/**
 * Earn bonus tokens from referrals
 * Reward: 10% of referred user's earnings
 */
export function earnFromReferral(address, referralAmount = 0) {
  const bonusReward = referralAmount * 0.1; // 10% referral bonus

  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    bonusReward,
    'referral',
    `Referral bonus earned`
  );
}

/**
 * Earn tokens from governance participation
 * Reward: 0.5 BDAG per vote (incentivizes participation)
 */
export function earnFromGovernance(address, proposalId) {
  const reward = 0.5; // BDAG

  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    reward,
    'governance',
    `Voted on proposal #${proposalId}`
  );
}

/**
 * Earn tokens from community contributions
 * Variable rewards based on contribution type
 */
export function earnFromContribution(address, contributionType, amount = 0.5) {
  const earnings = getOrCreateTokenEarnings(address);
  return earnings.addEarning(
    amount,
    'community',
    `Community contribution: ${contributionType}`
  );
}

/**
 * Get total pending tokens for user
 */
export function getPendingTokens(address) {
  const earnings = getOrCreateTokenEarnings(address);
  return earnings.pendingBalance;
}

/**
 * Get total claimed tokens for user
 */
export function getClaimedTokens(address) {
  const earnings = getOrCreateTokenEarnings(address);
  return earnings.claimedBalance;
}

/**
 * Get total earned tokens (all time)
 */
export function getTotalTokens(address) {
  const earnings = getOrCreateTokenEarnings(address);
  return earnings.totalEarned;
}

/**
 * Claim all pending tokens
 * Simulates blockchain transaction
 */
export function claimPendingTokens(address) {
  const earnings = getOrCreateTokenEarnings(address);
  const claim = earnings.claimEarnings();
  
  if (!claim) {
    throw new Error('No pending tokens to claim');
  }

  // Cache the claim
  tokenCache.set(`claim:${address}:${claim.txHash}`, claim);

  return claim;
}

/**
 * Get earnings history for user
 */
export function getEarningsHistory(address, limit = 50) {
  const earnings = getOrCreateTokenEarnings(address);
  return earnings.earnings.slice(-limit).reverse();
}

/**
 * Get earnings breakdown (amount earned per source)
 */
export function getEarningsBreakdown(address) {
  const earnings = getOrCreateTokenEarnings(address);
  return earnings.getEarningBreakdown();
}

/**
 * Reset earnings (for testing/demo only)
 */
export function resetEarnings(address) {
  delete userEarnings[address];
  return true;
}

/**
 * Calculate daily earning potential
 */
export function calculateDailyEarningPotential(userStats = {}) {
  const {
    level = 1,
    reputation = 0,
    nftCount = 1,
    avgNFTLevel = 1
  } = userStats;

  // Base earnings from tapping (1 hour of active tapping)
  const tapEarnings = 0.001 * 600 * (1 + (level - 1) * 0.1); // ~3.6 taps/min for 10 min

  // NFT evolution potential (1 per day)
  const evolutionEarnings = 0.1 + (avgNFTLevel * 0.05);

  // Reputation passive income
  const reputationEarnings = reputation * 0.0001; // 0.01% of rep per day

  // Mission completion potential (assume 1 mission/day)
  const missionEarnings = 0.5;

  // Login bonus
  const loginEarnings = 0.1;

  const total = tapEarnings + evolutionEarnings + reputationEarnings + missionEarnings + loginEarnings;

  return {
    tapEarnings: parseFloat(tapEarnings.toFixed(4)),
    evolutionEarnings: parseFloat(evolutionEarnings.toFixed(4)),
    reputationEarnings: parseFloat(reputationEarnings.toFixed(4)),
    missionEarnings: parseFloat(missionEarnings.toFixed(4)),
    loginEarnings: parseFloat(loginEarnings.toFixed(4)),
    totalDaily: parseFloat(total.toFixed(4)),
    totalMonthly: parseFloat((total * 30).toFixed(4))
  };
}

/**
 * Helper: Generate claim transaction hash
 */
function generateClaimHash() {
  return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Helper: Calculate token value (for display)
 */
export function tokenToUSD(tokenAmount, bdagPrice = 0.15) {
  return (tokenAmount * bdagPrice).toFixed(2);
}
