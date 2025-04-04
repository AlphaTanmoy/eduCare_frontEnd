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
  private IndexedDBExpirationTime = 900000; //15min

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

    this.ensureDBReady();
  }

  private async ensureDBReady() {
    await new Promise(resolve => setTimeout(resolve, 50));
    await this.cleanupExpiredItems();
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
    const items = await this.DB.getAll('eci.items');

    for (const item of items) {
      if (item.expirationTime <= Date.now()) {
        await this.deleteItem(item.id);
      }
    }
  }
}
