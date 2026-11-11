/**
 * HEX BASTION - AI Strategy & Decision Engine Module
 */
import { HEX_DIRECTIONS, TERRAIN, UNIT_TYPES } from '../core/constants.js';

export const AIMethods = {
  // ================= AI =================
  updateAI(dt) {
    if (this.isGameOver || this.isPvP) return;

    if (this.aiEnergy < this.maxEnergy) {
      this.aiEnergy = Math.min(this.maxEnergy, this.aiEnergy + dt * 0.75);
    }

    const now = performance.now() / 1000;
    let baseActionDelay = 2.4; // NORMAL: was 1.6s
    if (this.cpuDifficulty === 'EASY') baseActionDelay = 3.6; // was 3.0s
    else if (this.cpuDifficulty === 'HARD') baseActionDelay = 1.2; // was 0.9s

    const actionDelay = baseActionDelay * this.getRecastMultiplier();
    if (now - this.aiLastActionTime < actionDelay) return;

    // AI Card Usage: tuned probability + minimum 10s cooldown so cards aren't spammed
    const cardUseProb = (this.cpuDifficulty === 'HARD') ? 0.22 : (this.cpuDifficulty === 'EASY' ? 0.05 : 0.10);
    const unspentAiCards = this.enemyCards.filter(c => !c.used);
    if (unspentAiCards.length > 0 && (now - this.aiLastCardTime >= 10.0) && Math.random() < cardUseProb) {
      const cardToUse = unspentAiCards[0];
      cardToUse.used = true;
      this.notifyCardUsedByEnemy(cardToUse);
      this.applyEnemyCardEffect(cardToUse, null);
      this.updateEnemyCardsUI();
      this.aiLastActionTime = now;
      this.aiLastCardTime = now;
      return;
    }

    const aiUnits = Array.from(this.units.values()).filter(u => u.owner === this.enemyTeam && !u.isMoving && u.moveCooldown <= 0);

    // AI Move: relaxed move probabilities so CPU doesn't feel like a relentless machine
    const moveProb = (this.cpuDifficulty === 'HARD') ? 0.75 : (this.cpuDifficulty === 'EASY' ? 0.35 : 0.50);
    if (aiUnits.length > 0 && Math.random() < moveProb) {
      const unitToMove = aiUnits[Math.floor(Math.random() * aiUnits.length)];
      const validMoves = this.getValidMovesForUnit(unitToMove);

      if (validMoves.length > 0) {
        let chosenKey = validMoves[0];

        const isRelaxedMove = (this.cpuDifficulty === 'EASY' && Math.random() < 0.50) ||
                              (this.cpuDifficulty === 'NORMAL' && Math.random() < 0.25);

        if (isRelaxedMove) {
          // Relaxed/random lateral move: gives the player opportunities to exploit!
          chosenKey = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
          // Tactical scoring
          const scoredMoves = validMoves.map(k => {
            const c = this.grid.get(k);
            let score = (c.r - unitToMove.r) * 4;
            if (c.terrain === TERRAIN.HIGH_GROUND) score += (this.cpuDifficulty === 'HARD' ? 10 : 5);
            // On HARD, bonus for moving closer to player core
            if (this.cpuDifficulty === 'HARD') {
              score += (c.r) * 2;
            }
            return { key: k, score };
          });

          scoredMoves.sort((a, b) => b.score - a.score);
          chosenKey = scoredMoves[0].key;
        }

        this.executeUnitMove(unitToMove, chosenKey, false);
        this.aiLastActionTime = now;
        return;
      }
    }

    // Policy B: No mid-battle deployment. Players fight purely with fielded units.
  }

};
