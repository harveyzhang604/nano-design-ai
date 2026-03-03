// 历史记录类型定义
export interface HistoryItem {
  id: string;
  prompt: string;
  category: string;
  domain: string;
  imageUrl: string;
  r2Url?: string; // R2 永久存储 URL
  timestamp: number;
  createdAt: string;
}

// 本地存储 key
const HISTORY_STORAGE_KEY = 'nano-design-history';

/**
 * 获取历史记录
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * 保存新的历史记录
 */
export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp' | 'createdAt'>): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    timestamp: Date.now(),
    createdAt: new Date().toLocaleString('zh-CN'),
  };

  const history = getHistory();
  const updatedHistory = [newItem, ...history].slice(0, 50); // 最多保存 50 条

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save history:', error);
  }

  return newItem;
}

/**
 * 删除历史记录
 */
export function deleteHistoryItem(id: string): void {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
}

/**
 * 清空所有历史记录
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
