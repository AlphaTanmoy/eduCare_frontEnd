import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { IndexedDB } from '../../constants/commonConstants';

@Injectable({
  providedIn: 'root'
})

export class IndexedDbService {
  private db!: IDBPDatabase<IndexedDB>;
  private dbName = 'eci.educare.db';
  private dbVersion = 1;

  constructor() {
    this.initDB();
  }

  async initDB() {
    this.db = await openDB<IndexedDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('eci.items')) {
          db.createObjectStore('eci.items', { keyPath: 'id' });
        }
      },
    });
  }

  private async ensureDBReady() {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  async addItem(id: string, value: any) {
    await this.ensureDBReady();
    return this.db.put('eci.items', { id, value });
  }

  async getItem(id: string) {
    await this.ensureDBReady();
    return this.db.get('eci.items', id);
  }

  async deleteItem(id: string) {
    await this.ensureDBReady();
    return this.db.delete('eci.items', id);
  }

  async getAllItems() {
    await this.ensureDBReady();
    return this.db.getAll('eci.items');
  }
}
