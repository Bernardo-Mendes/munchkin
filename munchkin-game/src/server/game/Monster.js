// Monster.js
const DungeonCard = require('./DungeonCard');

class Monster extends DungeonCard {
  constructor(id, name, description, level, treasureReward, badStuff) {
    super(id, name, description, 'MONSTER');
    this.level = level;
    this.treasureReward = treasureReward;
    this.badStuff = badStuff;
    this.modifiers = []; // Inicializado como array vazio
    this.combatPower = this.calculateCombatPower();
  }

  calculateCombatPower() {
    // Proteção para garantir que `modifiers` é sempre um array
    if (!Array.isArray(this.modifiers)) {
      console.error('Modifiers is not an array:', this.modifiers);
      this.modifiers = [];
    }

    // Base combat power é o nível do monstro somado aos modificadores
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
    // Proteção para validar o modificador antes de adicionar
    if (!modifier || typeof modifier !== 'object') {
      console.error('Invalid modifier:', modifier);
      return;
    }

    this.modifiers = [...this.modifiers, modifier];
    this.combatPower = this.calculateCombatPower();
  }

  play() {
    // Monstros geralmente são jogados iniciando o combate
    // A lógica do combate é tratada pela classe Combat
    const gameInstance = Game.getInstance();
    if (!gameInstance) {
      console.error('Game instance not found');
      return;
    }
    const currentPlayer = gameInstance.getCurrentPlayer();
    if (!currentPlayer) {
      console.error('Current player not found');
      return;
    }
    return this.fight(currentPlayer);
  }
}

module.exports = Monster;
