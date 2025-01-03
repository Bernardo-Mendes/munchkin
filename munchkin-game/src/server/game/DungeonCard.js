// DungeonCard.js
const Card = require('./Card');

class DungeonCard extends Card {
  constructor(id, name, description, type) {
    super(id, name, description);
    this.type = type; // MONSTER, CURSE, or EFFECT
  }

  applyEffect() {
    // Implementation depends on card type
    switch (this.type) {
      case 'MONSTER':
        // Monster handling is done in Monster class
        break;
      case 'CURSE':
        // Curse handling is done in CurseCard class
        break;
      case 'EFFECT':
        // Apply immediate effect
        break;
      default:
        throw new Error('Invalid dungeon card type');
    }
  }

  play() {
    this.applyEffect();
  }
}

module.exports = DungeonCard;