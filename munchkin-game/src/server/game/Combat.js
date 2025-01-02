// Combat class (src/server/game/Combat.js)
class Combat {
    constructor(player, monster) {
      this.player = player;
      this.monster = monster;
      this.helpers = [];
      this.modifiers = [];
    }
  
    calculateTotalPower() {
      let totalPower = this.player.calculateCombatPower();
      
      // Add power from helpers
      this.helpers.forEach(helper => {
        totalPower += helper.calculateCombatPower();
      });
  
      // Apply modifiers
      this.modifiers.forEach(modifier => {
        if (modifier.type === 'MULTIPLY') {
          totalPower *= modifier.value;
        } else {
          totalPower += modifier.value;
        }
      });
  
      return totalPower;
    }
  
    addHelper(player) {
      this.helpers.push(player);
    }
  
    addModifier(modifier) {
      this.modifiers.push(modifier);
    }
  
    scapeFromCombat() {
      // Roll dice (1-6)
      const roll = Math.floor(Math.random() * 6) + 1;
      return roll >= 5; // Success on 5 or 6
    }
  
    resolveCombat() {
      const playerPower = this.calculateTotalPower();
      const monsterPower = this.monster.calculateCombatPower();
  
      if (playerPower > monsterPower) {
        // Player wins
        this.player.levelUp();
        // Distribute treasure
        for (let i = 0; i < this.monster.treasureReward; i++) {
          const treasure = Game.getInstance().treasureDeck.drawCard();
          this.player.addCardToHand(treasure);
        }
        return { result: 'WIN', treasure: this.monster.treasureReward };
      } else {
        // Player loses
        this.monster.applyBadStuff(this.player);
        return { result: 'LOSE', badStuff: this.monster.badStuff };
      }
    }
  }
  
  // Deck class (src/server/game/Deck.js)
  class Deck {
    constructor() {
      this.cards = [];
      this.discardPile = [];
    }
  
    createCard(cardType) {
      throw new Error('Method createCard() must be implemented by subclasses');
    }
  
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
  
    drawCard() {
      if (this.cards.length === 0) {
        this.reshuffle();
      }
      return this.cards.pop();
    }
  
    addToDiscard(card) {
      this.discardPile.push(card);
    }
  
    reshuffle() {
      this.cards = [...this.discardPile];
      this.discardPile = [];
      this.shuffle();
    }
  }
  
  // DungeonDeck class (src/server/game/DungeonDeck.js)
  class DungeonDeck extends Deck {
    createCard(cardType) {
      // Factory method implementation
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
  
  // TreasureDeck class (src/server/game/TreasureDeck.js)
  class TreasureDeck extends Deck {
    createCard(cardType) {
      // Factory method implementation
      switch (cardType) {
        case 'ITEM':
          return new Item(/* parameters */);
        default:
          return new TreasureCard(/* parameters */);
      }
    }
  }
  
  module.exports = {
    Combat,
    Deck,
    DungeonDeck,
    TreasureDeck
  };