"use client";
import { useState, useEffect } from 'react';
import { X, Trash2, RotateCcw, Download } from 'lucide-react';
import { getHistory, deleteHistoryItem, clearHistory, type HistoryItem } from '../lib/history';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string, category: string, domain: string) => void;
}

export default function HistoryModal({ isOpen, onClose, onSelectPrompt }: HistoryModalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory());
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleReuse = (item: HistoryItem) => {
    onSelectPrompt(item.prompt, item.category, item.domain);
    onClose();
  };

  const handleDownload = async (imageUrl: string, id: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nano-design-${id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl font-bold text-neutral-100">生成历史</h2>
            <p className="text-sm text-neutral-400 mt-1">共 {history.length} 条记录</p>
          </div>
          <div className="flex gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                清空全部
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
              aria-label="关闭"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-10 h-10 text-neutral-600" />
              </div>
              <p className="text-neutral-400 text-lg">暂无生成历史</p>
              <p className="text-neutral-600 text-sm mt-2">开始创作后，历史记录会显示在这里</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-800/50 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all group"
                >
                  {/* Image */}
                  <div 
                    className="aspect-[4/3] bg-neutral-900 relative cursor-pointer overflow-hidden"
                    onClick={() => setSelectedImage(item.imageUrl)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-sm text-neutral-300 line-clamp-2 mb-2 leading-relaxed">
                      {item.prompt}
                    </p>
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded">
                        {item.domain}
                      </span>
                      <span className="text-xs px-2 py-1 bg-neutral-700 text-neutral-400 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-3">{item.createdAt}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReuse(item)}
                        className="flex-1 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        重新使用
                      </button>
                      <button
                        onClick={() => handleDownload(item.imageUrl, item.id)}
                        className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 rounded-lg transition-colors"
                        aria-label="下载"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        aria-label="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
