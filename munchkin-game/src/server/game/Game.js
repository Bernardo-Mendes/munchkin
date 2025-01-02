const Player = require('./Player');
const DungeonDeck = require('./DungeonDeck');
const TreasureDeck = require('./TreasureDeck');

class Game {
  static instance = null;
  
  constructor() {
    if (Game.instance) {
      throw new Error('Game instance already exists!');
    }
    
    this.players = [];
    this.dungeonDeck = new DungeonDeck();
    this.treasureDeck = new TreasureDeck();
    this.currentTurn = 0;
    this.gameStatus = 'WAITING'; // WAITING, PLAYING, ENDED
    
    Game.instance = this;
  }

  static getInstance() {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  startGame() {
    if (this.players.length < 2) {
      throw new Error('Need at least 2 players to start the game');
    }

    this.gameStatus = 'PLAYING';
    this.dungeonDeck.shuffle();
    this.treasureDeck.shuffle();

    // Distribute initial cards
    this.players.forEach(player => {
      for (let i = 0; i < 4; i++) {
        player.addCardToHand(this.dungeonDeck.drawCard());
        player.addCardToHand(this.treasureDeck.drawCard());
      }
    });

    // Randomly decide first player
    this.currentTurn = Math.floor(Math.random() * this.players.length);
  }

  endGame() {
    this.gameStatus = 'ENDED';
    // Calculate final scores, determine winner, etc.
  }

  nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
  }

  addPlayer(playerData) {
    if (this.gameStatus !== 'WAITING') {
      throw new Error('Cannot add player - game already started');
    }
    
    const player = new Player(playerData.id, playerData.name);
    this.players.push(player);
    return player;
  }

  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index !== -1) {
      return this.players.splice(index, 1)[0];
    }
    return null;
  }

  getCurrentPlayer() {
    return this.players[this.currentTurn];
  }

  getGameState() {
    return {
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        level: p.level,
        race: p.race,
        class: p.class,
        combatPower: p.calculateCombatPower()
      })),
      currentTurn: this.currentTurn,
      gameStatus: this.gameStatus,
      currentPlayer: this.getCurrentPlayer()?.id
    };
  }

  handleCardPlay(cardData) {
    const player = this.getCurrentPlayer();
    const card = player.hand.find(c => c.id === cardData.cardId);
    
    if (!card) {
      throw new Error('Card not found in player hand');
    }

    card.play();
  }
}

module.exports = Game;