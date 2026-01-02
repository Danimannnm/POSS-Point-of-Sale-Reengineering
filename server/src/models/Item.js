// src/models/Item.js
export default class Item {
  constructor(itemID, itemName, price, amount) {
    this.itemID = itemID;
    this.itemName = itemName;
    this.price = price;
    this.amount = amount;
  }
}
