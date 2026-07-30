import Phaser from 'phaser';

export interface InventoryItem {
  id: string;
  name: string;
  textureKey: string;
}

const ALL_ITEMS: InventoryItem[] = [
  { id: 'flippers',    name: 'Ласты',          textureKey: 'flippers' },
  { id: 'garden_hose', name: 'Садовый шланг',  textureKey: 'hose' },
  { id: 'aquarium',    name: 'Аквариум',       textureKey: 'aquarium' },
  { id: 'ruler',       name: 'Линейка',        textureKey: 'ruler' },
  { id: 'rubber_hose', name: 'Резиновый шланг',textureKey: 'hose' },
  { id: 'nuts',        name: 'Гайки',          textureKey: 'nuts' },
  { id: 'gloves',      name: 'Перчатки',       textureKey: 'gloves' },
  { id: 'sunglasses',  name: 'Очки',           textureKey: 'glasses' },
  { id: 'bag',         name: 'Пакет',          textureKey: 'bag' },
  { id: 'shells',      name: 'Ракушки',        textureKey: 'shells' },
];

class InventoryManager {
  private collectedIds = new Set<string>();
  public events = new Phaser.Events.EventEmitter();
  public uiOpen = false;
  private assembled = false;

  addItem(itemId: string) {
    if (this.collectedIds.has(itemId)) return;
    this.collectedIds.add(itemId);
    this.events.emit('itemAdded', itemId);
    if (this.collectedIds.size === ALL_ITEMS.length) {
      this.events.emit('allCollected');
    }
  }

  isCollected(itemId: string): boolean {
    return this.collectedIds.has(itemId);
  }

  getAllItems(): (InventoryItem & { collected: boolean })[] {
    return ALL_ITEMS.map(item => ({
      ...item,
      collected: this.collectedIds.has(item.id),
    }));
  }

  hasAllItems(): boolean {
    return this.collectedIds.size === ALL_ITEMS.length;
  }

  isSuitAssembled(): boolean {
    return this.assembled;
  }

  assembleSuit() {
    if (this.assembled || !this.hasAllItems()) return;
    this.assembled = true;
    this.events.emit('suitAssembled');
  }

  /** Принудительно активирует костюм (например, из шкафа) */
  forceAssembleSuit() {
    if (this.assembled) return;
    this.assembled = true;
    this.events.emit('suitAssembled');
  }

  openUI() {
    this.uiOpen = true;
    this.events.emit('uiStateChanged', true);
  }

  closeUI() {
    this.uiOpen = false;
    this.events.emit('uiStateChanged', false);
  }
}

export const inventoryManager = new InventoryManager();