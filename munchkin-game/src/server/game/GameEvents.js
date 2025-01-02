const EventEmitter = require('events');

class GameEvents extends EventEmitter {
  constructor() {
    super();
    this.registerEvents();
  }

  registerEvents() {
    // Game state events
    this.on('gameStateUpdate', (gameState) => {
      this.broadcastToPlayers('gameStateUpdated', gameState);
    });

    // Combat events
    this.on('combatStart', (data) => {
      this.broadcastToPlayers('combatStarted', {
        player: data.player.name,
        monster: data.monster.name,
        monsterLevel: data.monster.level
      });
    });

    this.on('combatEnd', (data) => {
      this.broadcastToPlayers('combatEnded', {
        winner: data.winner,
        rewards: data.rewards,
        consequences: data.consequences
      });
    });

    // Player events
    this.on('playerJoin', (player) => {
      this.broadcastToPlayers('playerJoined', {
        id: player.id,
        name: player.name,
        level: player.level
      });
    });

    this.on('playerLeave', (player) => {
      this.broadcastToPlayers('playerLeft', {
        id: player.id,
        name: player.name
      });
    });

    // Card events
    this.on('cardPlayed', (data) => {
      this.broadcastToPlayers('cardWasPlayed', {
        playerId: data.player.id,
        cardName: data.card.name,
        effect: data.effect
      });
    });

    // Turn events
    this.on('turnChange', (data) => {
      this.broadcastToPlayers('turnChanged', {
        currentPlayer: data.currentPlayer.name,
        phase: data.phase
      });
    });
  }

  broadcastToPlayers(eventName, data) {
    // This method will be set by the socket.io configuration
    if (this.socketIO) {
      this.socketIO.to('game-room').emit(eventName, data);
    }
  }

  setSocketIO(io) {
    this.socketIO = io;
  }
}

module.exports = new GameEvents();