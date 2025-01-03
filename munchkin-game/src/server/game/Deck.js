// Deck.js
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
  
  module.exports = Deck;