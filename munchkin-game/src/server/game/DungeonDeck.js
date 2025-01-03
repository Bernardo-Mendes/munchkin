// DungeonDeck.js
const  Deck  = require('./Deck');
const  Monster  = require('./Monster');
const  CurseCard  = require('./CurseCard');

class DungeonDeck extends Deck {
  constructor() {
    super();
    this.initializeDeck();
  }

  initializeDeck() {
    // Add monsters
    this.addMonsters();
    // Add curses
    this.addCurses();
    // Add other dungeon cards
    this.addOtherCards();
    // Shuffle the deck
    this.shuffle();
  }

  addMonsters() {
    // Example monsters
    this.cards.push(
      new Monster('M1', 'Goblin', 'A small but nasty creature', 1, 1, 
        player => player.levelDown()),
      new Monster('M2', 'Dragon', 'A fearsome beast', 10, 3, 
        player => { player.levelDown(); player.levelDown(); }),
      new Monster('M3', 'Orc', 'A fierce warrior', 4, 2,
        player => player.discardRandomItem())
    );
  }

  addCurses() {
    this.cards.push(
      new CurseCard('C1', 'Lose a Level', 'Drop one level', 1, 'LEVEL_LOSS'),
      new CurseCard('C2', 'Lose Armor', 'Lose your armor', 1, 'ITEM_LOSS'),
      new CurseCard('C3', 'Combat Curse', 'Lose 2 combat power next fight', 2, 'COMBAT_PENALTY')
    );
  }

  addOtherCards() {
    // Add other dungeon cards as needed
    // This could include traps, room effects, etc.
  }

  createCard(cardType) {
    switch (cardType) {
      case 'MONSTER':
        return new Monster(/* parameters */);
      case 'CURSE':
        return new CurseCard(/* parameters */);
      default:
        return new DungeonCard(/* parameters */);
    }
  }
}

module.exports = DungeonDeck;