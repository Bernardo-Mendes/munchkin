const Game = require('../game/Game');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle player joining the game
    socket.on('joinGame', (playerData) => {
      try {
        const game = Game.getInstance();
        const player = game.addPlayer({
          id: socket.id,
          name: playerData.name
        });

        socket.join('game-room');
        
        // Notify all players about the new player
        io.to('game-room').emit('playerJoined', {
          players: game.players,
          message: `${player.name} joined the game`
        });
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Handle player actions
    socket.on('playCard', (cardData) => {
      try {
        const game = Game.getInstance();
        const player = game.getCurrentPlayer();
        
        if (player.id !== socket.id) {
          throw new Error('Not your turn');
        }

        // Handle card playing logic
        game.handleCardPlay(cardData);
        
        // Broadcast updated game state
        io.to('game-room').emit('gameStateUpdated', game.getGameState());
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      try {
        const game = Game.getInstance();
        const player = game.removePlayer(socket.id);
        
        if (player) {
          io.to('game-room').emit('playerLeft', {
            players: game.players,
            message: `${player.name} left the game`
          });
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });

    // Other game events will be added here
  });
};