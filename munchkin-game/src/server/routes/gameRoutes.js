const express = require('express');
const router = express.Router();
const Game = require('../game/Game');
const gameEvents = require('../game/GameEvents');

// Middleware to get game instance
const getGame = (req, res, next) => {
  req.game = Game.getInstance();
  next();
};

// Get game state
router.get('/state', getGame, (req, res) => {
  try {
    const gameState = req.game.getGameState();
    res.json({ success: true, state: gameState });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start game
router.post('/start', getGame, (req, res) => {
  try {
    req.game.startGame();
    const gameState = req.game.getGameState();
    gameEvents.emit('gameStateUpdate', gameState);
    res.json({ success: true, state: gameState });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Play a card
router.post('/play-card', getGame, (req, res) => {
  try {
    const { playerId, cardId } = req.body;
    const player = req.game.players.find(p => p.id === playerId);
    
    if (!player) {
      throw new Error('Player not found');
    }

    const card = player.hand.find(c => c.id === cardId);
    if (!card) {
      throw new Error('Card not found');
    }

    const result = card.play();
    gameEvents.emit('cardPlayed', { player, card, effect: result });
    
    const gameState = req.game.getGameState();
    gameEvents.emit('gameStateUpdate', gameState);
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Handle combat action
router.post('/combat', getGame, (req, res) => {
  try {
    const { action, playerId, targetId } = req.body;
    const player = req.game.players.find(p => p.id === playerId);
    const currentTurn = req.game.getCurrentTurn();
    
    if (!currentTurn.combatInProgress) {
      throw new Error('No combat in progress');
    }

    const result = currentTurn.executePhase({
      type: action,
      playerId: targetId
    });

    gameEvents.emit('gameStateUpdate', req.game.getGameState());
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;