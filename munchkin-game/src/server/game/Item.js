// Item.js
const TreasureCard = require('./TreasureCard');

class Item extends TreasureCard {
  constructor(id, name, description, value, bonus, slot, requirements = []) {
    super(id, name, description, value, 'ITEM');
    this.bonus = bonus;
    this.slot = slot;
    this.requirements = requirements;
  }

  canBeEquipped(player) {
    // Check all requirements
    return this.requirements.every(req => {
      switch (req.type) {
        case 'CLASS':
          return !req.class || player.class?.name === req.class;
        case 'RACE':
          return !req.race || player.race?.name === req.race;
        case 'LEVEL':
          return player.level >= req.level;
        default:
          return true;
      }
    });
  }

  applyBonus(player) {
    player.combatPower += this.bonus;
  }

  removeBonus(player) {
    player.combatPower -= this.bonus;
  }

  play() {
    // Items are typically played by equipping them
    // The actual equip logic is handled by the Player class
    return true;
  }
}

module.exports = Item;