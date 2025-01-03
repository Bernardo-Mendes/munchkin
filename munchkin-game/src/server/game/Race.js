class Race {
    constructor(name) {
      this.name = name;
      this.abilities = this.initializeAbilities();
    }
  
    initializeAbilities() {
      // Each race will override this with their specific abilities
      return [];
    }
  
    applyRacialBonus() {
      // Calculate total racial bonus from passive abilities
      return this.abilities
        .filter(ability => ability.type === 'PASSIVE')
        .reduce((total, ability) => total + ability.bonus, 0);
    }
  
    canUseItem(item) {
      // Check race-specific item restrictions
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
          },
          description: 'Elves get +2 against monsters level 2 or lower'
        }
      ];
    }
  }
  
  class Dwarf extends Race {
    constructor() {
      super('Dwarf');
    }
  
    initializeAbilities() {
      return [
        {
          name: 'Stout',
          type: 'PASSIVE',
          bonus: 2,
          description: 'Dwarves get +2 when using melee weapons'
        }
      ];
    }
  
    // Override to add special handling for melee weapons
    canUseItem(item) {
      if (super.canUseItem(item)) {
        // Add bonus to melee weapons
        if (item.type === 'WEAPON' && item.subtype === 'MELEE') {
          item.bonus += 2;
        }
        return true;
      }
      return false;
    }
  }
  
  class Halfling extends Race {
    constructor() {
      super('Halfling');
    }
  
    initializeAbilities() {
      return [
        {
          name: 'Lucky',
          type: 'PASSIVE',
          bonus: 1,
          description: 'Halflings get +1 to run away'
        },
        {
          name: 'Nimble',
          type: 'ACTIVE',
          use: (combat) => {
            combat.addModifier({ type: 'ESCAPE', value: 2 });
          },
          description: 'Once per combat, get +2 to run away'
        }
      ];
    }
  }
  
  module.exports = {
    Race,
    Human,
    Elf,
    Dwarf,
    Halfling
  };