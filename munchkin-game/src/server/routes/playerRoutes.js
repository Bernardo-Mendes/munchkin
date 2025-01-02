const express = require('express');
const router = express.Router();
const Game = require('../game/Game');
const gameEvents = require('../game/GameEvents');
const { Warrior, Wizard } = require('../game/CharacterClass');
const { Human, Elf } = require('../game/Race');

// Get player info
router.get('/:playerId', (req, res) => {
  try {
    const game = Game.getInstance();
    const player = game.players.find(p => p.id === req.params.playerId);
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }

    res.json({
      success: true,
      player: {
        id: player.id,
        name: player.name,
        level: player.level,
        race: player.race?.name,
        class: player.class?.name,
        hand: player.hand.length,
        equippedItems: player.equippedItems,
        combatPower: player.calculateCombatPower()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Select character class
router.post('/:playerId/class', (req, res) => {
  try {
    const game = Game.getInstance();
    const player = game.players.find(p => p.id === req.params.playerId);
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }

    const { className } = req.body;
    switch (className.toLowerCase()) {
      case 'warrior':
        player.class = new Warrior();
        break;
      case 'wizard':
        player.class = new Wizard();
        break;
      default:
        throw new Error('Invalid class name');
    }

    gameEvents.emit('gameStateUpdate', game.getGameState());
    res.json({ success: true, class: player.class });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Select race
router.post('/:playerId/race', (req, res) => {
  try {
    const game = Game.getInstance();
    const player = game.players.find(p => p.id === req.params.playerId);
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }

    const { raceName } = req.body;
    switch (raceName.toLowerCase()) {
      case 'human':
        player.race = new Human();
        break;
      case 'elf':
        player.race = new Elf();
        break;
      default:
        throw new Error('Invalid race name');
    }

    gameEvents.emit('gameStateUpdate', game.getGameState());
    res.json({ success: true, race: player.race });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Equip item
router.post('/:playerId/equip', (req, res) => {
  try {
    const game = Game.getInstance();
    const player = game.players.find(p => p.id === req.params.playerId);
    
    if (!player) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }

    const { itemId } = req.body;
    const item = player.hand.find(card => card.id === itemId);
    
    if (!item) {
      throw new Error('Item not found in player hand');
    }

    player.equipItem(item);
    gameEvents.emit('gameStateUpdate', game.getGameState());
    
    res.json({ success: true, equippedItem: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;