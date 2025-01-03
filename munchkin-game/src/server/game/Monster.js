// Monster.js
const { DungeonCard } = require('./DungeonCard');

class Monster extends DungeonCard {
  constructor(id, name, description, level, treasureReward, badStuff) {
    super(id, name, description, 'MONSTER');
    this.level = level;
    this.treasureReward = treasureReward;
    this.badStuff = badStuff;
    this.combatPower = this.calculateCombatPower();
    this.modifiers = [];
  }

  calculateCombatPower() {
    // Base combat power is monster level plus any modifiers
    let totalPower = this.level;
    this.modifiers.forEach(mod => {
      if (mod.type === 'MULTIPLY') {
        totalPower *= mod.value;
      } else {
        totalPower += mod.value;
      }
    });
    return totalPower;
  }

  fight(player) {
    const combat = new Combat(player, this);
    return combat.resolveCombat();
  }

  applyBadStuff(player) {
    if (typeof this.badStuff === 'function') {
      this.badStuff(player);
    }
  }

  addModifier(modifier) {
    this.modifiers.push(modifier);
    this.combatPower = this.calculateCombatPower();
  }

  play() {
    // Monsters are typically played by initiating combat
    // The actual combat logic is handled by the Combat class
    return this.fight(Game.getInstance().getCurrentPlayer());
  }
}

module.exports = Monster;