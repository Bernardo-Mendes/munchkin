// CurseCard.js
const { DungeonCard } = require('./Card');

class CurseCard extends DungeonCard {
  constructor(id, name, description, value, type) {
    super(id, name, description, 'CURSE');
    this.value = value;
    this.type = type;
  }

  applyCurse(player) {
    switch (this.type) {
      case 'LEVEL_LOSS':
        for (let i = 0; i < this.value; i++) {
          player.levelDown();
        }
        break;
      case 'ITEM_LOSS':
        // Randomly remove equipped items
        const itemsToRemove = player.equippedItems.slice(0, this.value);
        itemsToRemove.forEach(item => player.unequipItem(item));
        break;
      case 'COMBAT_PENALTY':
        player.temporaryEffects.push({
          type: 'COMBAT_MODIFIER',
          value: -this.value,
          duration: 1
        });
        break;
      default:
        throw new Error('Invalid curse type');
    }
  }

  play() {
    this.applyCurse();
  }
}

module.exports = CurseCard;