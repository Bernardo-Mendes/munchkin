// src/server/game/Turn.js
class Turn {
    constructor(player) {
      this.player = player;
      this.phase = 'START'; // START, KICK_DOOR, COMBAT, LOOT_ROOM, CHARITY, END
      this.combatInProgress = null;
    }
  
    async executePhase(action) {
      const game = require('./Game').getInstance();
  
      switch (this.phase) {
        case 'START':
          // Reset any temporary effects from previous turn
          this.player.temporaryEffects = [];
          this.phase = 'KICK_DOOR';
          return { message: "Your turn begins! Kick down the door!" };
  
        case 'KICK_DOOR':
          if (action !== 'kickDoor') {
            throw new Error('Must kick down the door first!');
          }
  
          const drawnCard = game.dungeonDeck.drawCard();
          if (drawnCard instanceof Monster) {
            // Found a monster - initiate combat
            this.combatInProgress = new Combat(this.player, drawnCard);
            this.phase = 'COMBAT';
            return {
              message: `You encountered ${drawnCard.name}!`,
              monster: drawnCard
            };
          } else {
            // No monster - can either look for trouble or loot the room
            this.phase = 'LOOT_ROOM';
            this.player.addCardToHand(drawnCard);
            return {
              message: `You found ${drawnCard.name}`,
              card: drawnCard
            };
          }
  
        case 'COMBAT':
          if (!this.combatInProgress) {
            throw new Error('No combat in progress');
          }
  
          switch (action.type) {
            case 'fight':
              const result = this.combatInProgress.resolveCombat();
              this.combatInProgress = null;
              this.phase = 'LOOT_ROOM';
              return result;
  
            case 'useItem':
              const item = this.player.hand.find(card => card.id === action.itemId);
              if (!item) throw new Error('Item not found');
              item.play();
              return { message: `Used ${item.name}` };
  
            case 'askForHelp':
              const helper = game.players.find(p => p.id === action.playerId);
              if (!helper) throw new Error('Player not found');
              this.combatInProgress.addHelper(helper);
              return { message: `${helper.name} joined the combat` };
  
            case 'runAway':
              const escaped = this.combatInProgress.scapeFromCombat();
              if (escaped) {
                this.combatInProgress = null;
                this.phase = 'END';
                return { message: 'Successfully ran away!' };
              } else {
                const badStuff = this.combatInProgress.monster.applyBadStuff(this.player);
                this.combatInProgress = null;
                this.phase = 'END';
                return {
                  message: 'Failed to run away!',
                  consequence: badStuff
                };
              }
          }
          break;
  
        case 'LOOT_ROOM':
          if (action === 'lookForTrouble') {
            const monsterCard = this.player.hand.find(card => card instanceof Monster);
            if (!monsterCard) {
              throw new Error('No monster card in hand');
            }
            this.combatInProgress = new Combat(this.player, monsterCard);
            this.phase = 'COMBAT';
            return {
              message: `Looking for trouble with ${monsterCard.name}`,
              monster: monsterCard
            };
          } else if (action === 'lootRoom') {
            const lootCard = game.treasureDeck.drawCard();
            this.player.addCardToHand(lootCard);
            this.phase = 'END';
            return {
              message: `Looted the room and found ${lootCard.name}`,
              card: lootCard
            };
          }
          break;
  
        case 'CHARITY':
          if (this.player.hand.length > 5) {
            if (!action.cards || action.cards.length < (this.player.hand.length - 5)) {
              throw new Error('Must discard down to 5 cards');
            }
            action.cards.forEach(cardId => {
              const card = this.player.removeCardFromHand(cardId);
              game.getCurrentDeck(card).addToDiscard(card);
            });
          }
          this.phase = 'END';
          return { message: 'Discarded excess cards' };
  
        case 'END':
          // Check if player needs to discard
          if (this.player.hand.length > 5) {
            this.phase = 'CHARITY';
            return {
              message: 'Too many cards! Discard down to 5',
              excess: this.player.hand.length - 5
            };
          }
          game.nextTurn();
          return { message: 'Turn ended' };
      }
    }
  }
  
  module.exports = Turn;