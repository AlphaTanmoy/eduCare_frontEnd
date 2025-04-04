import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { IndexedDB } from '../../constants/commonConstants';

@Injectable({
  providedIn: 'root'
})

export class IndexedDbService {
  private DB!: IDBPDatabase<IndexedDB>;
  private DbName = 'eci.educare.db';
  private DbVersion = 1;
  private IndexedDBExpirationTime = 15 * 60 * 1000; //15min
  private IndexedDBPeriodicCleanupTime = 5 * 60 * 1000; //5min

  constructor() {
    this.initDB();
  }

  async initDB() {
    this.DB = await openDB<IndexedDB>(this.DbName, this.DbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('eci.items')) {
          db.createObjectStore('eci.items', { keyPath: 'id' });
        }
      },
    });

    // Cleaning expired items on page load then start a periodically cleanup process
    this.cleanupExpiredItems();

    setInterval(() => {
      this.cleanupExpiredItems();
    }, this.IndexedDBPeriodicCleanupTime);
  }

  private async ensureDBReady() {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  async addItem(id: string, value: any) {
    await this.ensureDBReady();

    const expirationTimestamp = Date.now() + this.IndexedDBExpirationTime;
    const item = { id, value, expirationTimestamp };

    return this.DB.put('eci.items', item);
  }

  async getItem(id: string) {
    await this.ensureDBReady();

    const item = await this.DB.get('eci.items', id);
    return item;
  }

  async getAllItems() {
    await this.ensureDBReady();

    let items = await this.DB.getAll('eci.items');
    return items;
  }

  async deleteItem(id: string) {
    await this.ensureDBReady();
    return this.DB.delete('eci.items', id);
  }

  async cleanupExpiredItems() {
    await this.ensureDBReady();

    const items = await this.DB.getAll('eci.items');

    for (const item of items) {
      if (item.expirationTimestamp && Number(item.expirationTimestamp) <= Date.now()) {
        await this.deleteItem(item.id);
      }
    }
  }
}
