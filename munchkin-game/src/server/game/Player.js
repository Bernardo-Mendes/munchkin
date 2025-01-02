class Player {
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.level = 1;
      this.race = null;
      this.class = null;
      this.hand = [];
      this.equippedItems = [];
      this.combatPower = 0;
    }
  
    calculateCombatPower() {
      let totalPower = this.level; // Base power is equal to level
  
      // Add bonuses from equipped items
      this.equippedItems.forEach(item => {
        totalPower += item.bonus;
      });
  
      // Add race bonuses if any
      if (this.race) {
        totalPower += this.race.applyRacialBonus();
      }
  
      // Add class bonuses if any
      if (this.class) {
        const classBonus = this.class.abilities
          .filter(ability => ability.type === 'PASSIVE')
          .reduce((total, ability) => total + ability.bonus, 0);
        totalPower += classBonus;
      }
  
      this.combatPower = totalPower;
      return totalPower;
    }
  
    addCardToHand(card) {
      this.hand.push(card);
    }
  
    removeCardFromHand(cardId) {
      const index = this.hand.findIndex(card => card.id === cardId);
      if (index !== -1) {
        return this.hand.splice(index, 1)[0];
      }
      throw new Error('Card not found in hand');
    }
  
    levelUp() {
      this.level += 1;
      this.calculateCombatPower();
    }
  
    levelDown() {
      if (this.level > 1) {
        this.level -= 1;
        this.calculateCombatPower();
      }
    }
  
    equipItem(item) {
      // Check if player can equip this item
      if (!item.canBeEquipped(this)) {
        throw new Error('Cannot equip this item');
      }
  
      // Check if slot is available or needs to unequip existing item
      const existingItem = this.equippedItems.find(i => i.slot === item.slot);
      if (existingItem) {
        this.unequipItem(existingItem);
      }
  
      this.equippedItems.push(item);
      item.applyBonus(this);
      this.calculateCombatPower();
    }
  
    unequipItem(item) {
      const index = this.equippedItems.findIndex(i => i.id === item.id);
      if (index !== -1) {
        const removedItem = this.equippedItems.splice(index, 1)[0];
        removedItem.removeBonus(this);
        this.calculateCombatPower();
        return removedItem;
      }
      throw new Error('Item not found in equipped items');
    }
  }
  
  module.exports = Player;