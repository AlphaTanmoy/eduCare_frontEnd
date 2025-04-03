import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { IndexedDB } from '../../constants/commonConstants';

@Injectable({
  providedIn: 'root'
})

export class IndexedDbService {
  private db!: IDBPDatabase<IndexedDB>;
  private dbInitialized = false;

  constructor() {
    this.initDB();
  }

  async initDB() {
    this.db = await openDB<IndexedDB>('eci.educare.db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'id' });
        }
      },
    });
  }

  private async ensureDBReady() {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  async addItem(id: string, value: any) {
    await this.ensureDBReady();
    return this.db.put('items', { id, value });
  }

  async getItem(id: string) {
    await this.ensureDBReady();
    return this.db.get('items', id);
  }

  async deleteItem(id: string) {
    await this.ensureDBReady();
    return this.db.delete('items', id);
  }

  async getAllItems() {
    await this.ensureDBReady();
    return this.db.getAll('items');
  }
}
