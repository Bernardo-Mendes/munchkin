// Base Card class
class Card {
    constructor(id, name, description) {
      this.id = id;
      this.name = name;
      this.description = description;
    }
  
    play() {
      throw new Error('Method play() must be implemented by subclasses');
    }
  }
  
  // DungeonCard class
  class DungeonCard extends Card {
    constructor(id, name, description, type) {
      super(id, name, description);
      this.type = type; // MONSTER, CURSE, or EFFECT
    }
  
    applyEffect() {
      // Implementation depends on card type
      switch (this.type) {
        case 'MONSTER':
          // Monster handling is done in Monster class
          break;
        case 'CURSE':
          // Curse handling is done in CurseCard class
          break;
        case 'EFFECT':
          // Apply immediate effect
          break;
        default:
          throw new Error('Invalid dungeon card type');
      }
    }
  
    play() {
      this.applyEffect();
    }
  }
  
  // TreasureCard class
  class TreasureCard extends Card {
    constructor(id, name, description, value, type) {
      super(id, name, description);
      this.value = value;
      this.type = type; // ITEM, BUFF, or BONUS
    }
  
    applyBonus() {
      // Implementation depends on treasure type
      switch (this.type) {
        case 'ITEM':
          // Item handling is done in Item class
          break;
        case 'BUFF':
          // Apply temporary bonus
          break;
        case 'BONUS':
          // Apply immediate bonus
          break;
        default:
          throw new Error('Invalid treasure card type');
      }
    }
  
    play() {
      this.applyBonus();
    }
  }
  
  // Monster class
  class Monster extends DungeonCard {
    constructor(id, name, description, level, treasureReward, badStuff) {
      super(id, name, description, 'MONSTER');
      this.level = level;
      this.treasureReward = treasureReward;
      this.badStuff = badStuff;
      this.combatPower = this.calculateCombatPower();
    }
  
    calculateCombatPower() {
      return this.level + this.modifiers;
    }
  
    fight(player) {
      const combat = new Combat(player, this);
      return combat.resolveCombat();
    }
  
    applyBadStuff(player) {
      if (typeof this.badStuff === 'function') {
        this.badStuff(player);
      }
    }
  }
  
  // Item class
  class Item extends TreasureCard {
    constructor(id, name, description, value, bonus, slot, requirements = []) {
      super(id, name, description, value, 'ITEM');
      this.bonus = bonus;
      this.slot = slot;
      this.requirements = requirements;
    }
  
    canBeEquipped(player) {
      // Check all requirements
      return this.requirements.every(req => {
        switch (req.type) {
          case 'CLASS':
            return !req.class || player.class?.name === req.class;
          case 'RACE':
            return !req.race || player.race?.name === req.race;
          case 'LEVEL':
            return player.level >= req.level;
          default:
            return true;
        }
      });
    }
  
    applyBonus(player) {
      player.combatPower += this.bonus;
    }
  
    removeBonus(player) {
      player.combatPower -= this.bonus;
    }
  }
  
  module.exports = {
    Card,
    DungeonCard,
    TreasureCard,
    Monster,
    Item
  };