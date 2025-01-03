// TreasureDeck.js
const  Deck  = require('./Deck');
const  Item  = require('./Item');
const TreasureCard = require('./TreasureCard');

class TreasureDeck extends Deck {
  constructor() {
    super();
    this.initializeDeck();
  }

  initializeDeck() {
    // Add items
    this.addItems();
    // Add other treasure cards
    this.addOtherTreasures();
    // Shuffle the deck
    this.shuffle();
  }

  addItems() {
    // Example items
    this.cards.push(
      new Item('I1', 'Short Sword', 'A basic weapon', 100, 2, 'WEAPON', []),
      new Item('I2', 'Plate Mail', 'Heavy armor', 400, 3, 'ARMOR', [
        { type: 'CLASS', class: 'Warrior' }
      ]),
      new Item('I3', 'Magic Staff', 'A powerful magical weapon', 300, 4, 'WEAPON', [
        { type: 'CLASS', class: 'Wizard' }
      ]),
      new Item('I4', 'Elven Bow', 'A graceful weapon', 200, 3, 'WEAPON', [
        { type: 'RACE', race: 'Elf' }
      ])
    );
  }

  addOtherTreasures() {
    // Add one-time use items, level-up cards, etc.
    this.cards.push(
      new TreasureCard('T1', 'Level Up Potion', 'Gain one level', 100, 'LEVEL_UP'),
      new TreasureCard('T2', 'Magic Missile', 'Add 5 to combat', 0, 'COMBAT_BONUS'),
      new TreasureCard('T3', 'Blessing', 'Double your combat power', 0, 'BUFF')
    );
  }

  createCard(cardType) {
    switch (cardType) {
      case 'ITEM':
        return new Item(/* parameters */);
      default:
        return new TreasureCard(/* parameters */);
    }
  }
}

module.exports = TreasureDeck;