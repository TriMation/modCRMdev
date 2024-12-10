import { QuickAccessRecord } from '../types/quickAccess';

class QuickAccessStore {
  private static readonly MAX_RECORDS = 5;
  private static readonly STORAGE_KEY = 'quickAccessRecords';

  static getRecords(): QuickAccessRecord[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static addRecord(record: Omit<QuickAccessRecord, 'timestamp'>): void {
    const records = this.getRecords();
    const newRecord = { ...record, timestamp: new Date().toISOString() };
    
    // Remove duplicate if exists
    const filteredRecords = records.filter(r => 
      !(r.id === record.id && r.type === record.type)
    );
    
    // Add new record at the beginning
    const updatedRecords = [newRecord, ...filteredRecords]
      .slice(0, this.MAX_RECORDS);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRecords));
  }
}

export default QuickAccessStore;