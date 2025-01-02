// src/server/game/CharacterClass.js
class CharacterClass {
    constructor(name) {
      this.name = name;
      this.abilities = this.initializeAbilities();
    }
  
    initializeAbilities() {
      // Each class will override this with their specific abilities
      return [];
    }
  
    useAbility(ability, target) {
      const foundAbility = this.abilities.find(a => a.name === ability.name);
      if (!foundAbility) {
        throw new Error('Ability not found');
      }
  
      if (foundAbility.cooldown > 0) {
        throw new Error('Ability is on cooldown');
      }
  
      foundAbility.use(target);
      foundAbility.cooldown = foundAbility.maxCooldown;
    }
  
    canUseItem(item) {
      // Check class-specific item restrictions
      if (item.restrictions && item.restrictions.classes) {
        return item.restrictions.classes.includes(this.name);
      }
      return true;
    }
  }
  
  // Specific character classes
  class Warrior extends CharacterClass {
    constructor() {
      super('Warrior');
    }
  
    initializeAbilities() {
      return [
        {
          name: 'Berserker Rage',
          type: 'COMBAT',
          cooldown: 0,
          maxCooldown: 3,
          use: (combat) => {
            combat.addModifier({ type: 'ADD', value: 2 });
          }
        },
        {
          name: 'Shield Block',
          type: 'DEFENSE',
          cooldown: 0,
          maxCooldown: 2,
          use: (combat) => {
            combat.addModifier({ type: 'DEFENSE', value: 2 });
          }
        }
      ];
    }
  }
  
  class Wizard extends CharacterClass {
    constructor() {
      super('Wizard');
    }
  
    initializeAbilities() {
      return [
        {
          name: 'Fireball',
          type: 'COMBAT',
          cooldown: 0,
          maxCooldown: 2,
          use: (combat) => {
            combat.addModifier({ type: 'ADD', value: 3 });
          }
        },
        {
          name: 'Escape Spell',
          type: 'UTILITY',
          cooldown: 0,
          maxCooldown: 4,
          use: (player) => {
            player.canEscape = true;
          }
        }
      ];
    }
  
    // Wizards get bonus when using magical items
    canUseItem(item) {
      if (item.type === 'MAGICAL') {
        item.bonus += 1;
      }
      return super.canUseItem(item);
    }
  }
  
  // src/server/game/Race.js
  class Race {
    constructor(name) {
      this.name = name;
      this.abilities = this.initializeAbilities();
    }
  
    initializeAbilities() {
      return [];
    }
  
    applyRacialBonus() {
      // Calculate total racial bonus
      return this.abilities
        .filter(ability => ability.type === 'PASSIVE')
        .reduce((total, ability) => total + ability.bonus, 0);
    }
  
    canUseItem(item) {
      if (item.restrictions && item.restrictions.races) {
        return item.restrictions.races.includes(this.name);
      }
      return true;
    }
  }
  
  // Specific races
  class Human extends Race {
    constructor() {
      super('Human');
    }
  
    initializeAbilities() {
      return [
        {
          name: 'Versatile',
          type: 'PASSIVE',
          bonus: 1,
          description: 'Humans get +1 to all combat rolls'
        }
      ];
    }
  }
  
  class Elf extends Race {
    constructor() {
      super('Elf');
    }
  
    initializeAbilities() {
      return [
        {
          name: 'Graceful',
          type: 'PASSIVE',
          bonus: 1,
          description: 'Elves get +1 to run away'
        },
        {
          name: 'Archery',
          type: 'ACTIVE',
          use: (combat) => {
            if (combat.monster.level <= 2) {
              combat.addModifier({ type: 'ADD', value: 2 });
            }
          }
        }
      ];
    }
  }
  
  module.exports = {
    CharacterClass,
    Warrior,
    Wizard,
    Race,
    Human,
    Elf
  };