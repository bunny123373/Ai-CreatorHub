import { generateId } from './utils';
import type { HistoryItem } from '@/types';

const HISTORY_KEY = 'history';
const MAX_HISTORY_ITEMS = 50;

export function saveToHistory(
  type: HistoryItem['type'],
  input: string,
  output: string,
  metadata?: Record<string, unknown>
): void {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      id: generateId(),
      type,
      input,
      output,
      timestamp: Date.now(),
      metadata,
    };
    history.unshift(newItem);
    setStorageItem(HISTORY_KEY, history.slice(0, MAX_HISTORY_ITEMS));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    return getStorageItem<HistoryItem[]>(HISTORY_KEY) || [];
  } catch (error) {
    console.error('Failed to read history:', error);
    return [];
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory();
    const updated = history.filter((item) => item.id !== id);
    setStorageItem(HISTORY_KEY, updated);
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

function getStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage');
  }
}
