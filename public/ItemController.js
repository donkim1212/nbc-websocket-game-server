import Item from "./Item.js";

class ItemController {
  // INTERVAL_MIN = 0;
  // INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  unlockedItems = [{ id: 1, score: 5, min_interval: 3000, max_interval: 8000 }];

  constructor(ctx, itemImages, scaleRatio, speed) {
    if (ItemController.instance) return ItemController.instance;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    const index = this.getRandomNumber(0, this.unlockedItems.length - 1);
    const selectedItem = this.unlockedItems[index];
    this.setNextItemTime(selectedItem.min_interval, selectedItem.max_interval);
    ItemController.instance = this;
  }

  static getInstance() {
    return ItemController.instance;
  }

  setNextItemTime(minInterval, maxInterval) {
    this.nextInterval = this.getRandomNumber(minInterval, maxInterval);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  unlockItem(item) {
    this.unlockedItems.push(item);
  }

  setUnlockedItems(unlockedItems) {
    this.unlockedItems = unlockedItems;
  }

  createItem() {
    const index = this.getRandomNumber(0, this.unlockedItems.length - 1);
    const selectedItem = this.unlockedItems[index];
    this.createItemById(selectedItem.id);
    return selectedItem;
  }

  createItemById(itemId) {
    const itemInfo = this.itemImages[itemId];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(this.ctx, itemId, x, y, itemInfo.width, itemInfo.height, itemInfo.image);

    this.items.push(item);
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      const item = this.createItem();
      this.setNextItemTime(item.min_interval, item.max_interval);
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
