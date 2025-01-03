// TreasureCard.js
const Card = require('./Card');

class TreasureCard extends Card {
  constructor(id, name, description, value, type) {
    super(id, name, description);
    this.value = value;
    this.type = type; // ITEM, BUFF, or BONUS
  }

  applyBonus() {
    // Implementation depends on treasure type
    switch (this.type) {
      case 'ITEM':
        // Item handling is done in Item class
        break;
      case 'BUFF':
        // Apply temporary bonus
        break;
      case 'BONUS':
        // Apply immediate bonus
        break;
      default:
        throw new Error('Invalid treasure card type');
    }
  }

  play() {
    this.applyBonus();
  }
}

module.exports = TreasureCard;