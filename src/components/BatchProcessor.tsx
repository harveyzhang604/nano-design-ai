// 批量处理组件
// components/BatchProcessor.tsx

"use client";
import { useState, useRef } from 'react';
import { Upload, X, Download, Loader2, CheckCircle, AlertCircle } from '../components/icons';

interface BatchFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: string;
  error?: string;
  progress?: number;
}

interface BatchProcessorProps {
  onProcess: (files: File[]) => Promise<{ id: string; result: string }[]>;
  maxFiles?: number;
  acceptedFormats?: string[];
  toolName?: string;
}

export function BatchProcessor({
  onProcess,
  maxFiles = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  toolName = 'AI 处理'
}: BatchProcessorProps) {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 添加文件
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: BatchFile[] = [];
    const remainingSlots = maxFiles - files.length;

    for (let i = 0; i < Math.min(selectedFiles.length, remainingSlots); i++) {
      const file = selectedFiles[i];
      
      if (!acceptedFormats.includes(file.type)) {
        continue;
      }

      const id = `${Date.now()}-${i}`;
      const preview = URL.createObjectURL(file);

      newFiles.push({
        id,
        file,
        preview,
        status: 'pending',
        progress: 0
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  // 移除文件
  const handleRemoveFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // 批量处理
  const handleBatchProcess = async () => {
    if (files.length === 0 || isProcessing) return;

    setIsProcessing(true);

    // 更新所有文件状态为处理中
    setFiles(prev => prev.map(f => ({ ...f, status: 'processing' as const, progress: 0 })));

    try {
      const filesToProcess = files.map(f => f.file);
      const results = await onProcess(filesToProcess);

      // 更新结果
      setFiles(prev => prev.map(f => {
        const result = results.find(r => r.id === f.id);
        if (result) {
          return {
            ...f,
            status: 'completed' as const,
            result: result.result,
            progress: 100
          };
        }
        return {
          ...f,
          status: 'error' as const,
          error: '处理失败',
          progress: 0
        };
      }));
    } catch (error: any) {
      // 全部标记为错误
      setFiles(prev => prev.map(f => ({
        ...f,
        status: 'error' as const,
        error: error.message || '处理失败',
        progress: 0
      })));
    } finally {
      setIsProcessing(false);
    }
  };

  // 下载所有结果
  const handleDownloadAll = async () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.result);
    
    for (const file of completedFiles) {
      if (!file.result) continue;
      
      try {
        const response = await fetch(file.result);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processed-${file.file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  // 清空所有
  const handleClearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-neutral-700 hover:border-amber-500 rounded-2xl p-12 text-center cursor-pointer transition-colors bg-neutral-900/50 hover:bg-neutral-900"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-neutral-300">
            点击上传或拖拽文件到这里
          </p>
          <p className="text-sm text-neutral-500">
            支持 JPG、PNG、WebP 格式，最多 {maxFiles} 张图片
          </p>
          <p className="text-xs text-neutral-600">
            已添加 {files.length}/{maxFiles} 张
          </p>
        </div>
      </div>

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">待处理文件 ({files.length})</h3>
            <button
              onClick={handleClearAll}
              disabled={isProcessing}
              className="text-sm text-neutral-400 hover:text-neutral-300 disabled:opacity-50"
            >
              清空全部
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800"
              >
                {/* 预览图 */}
                <div className="aspect-square bg-neutral-800">
                  <img
                    src={file.status === 'completed' && file.result ? file.result : file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 状态覆盖层 */}
                {file.status === 'processing' && (
                  <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  </div>
                )}

                {file.status === 'completed' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}

                {file.status === 'error' && (
                  <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                )}

                {/* 移除按钮 */}
                {file.status === 'pending' && (
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-neutral-950/80 hover:bg-neutral-950 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* 文件名 */}
                <div className="p-2">
                  <p className="text-xs text-neutral-400 truncate">
                    {file.file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {files.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleBatchProcess}
            disabled={isProcessing || files.length === 0}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-neutral-700 disabled:to-neutral-700 rounded-xl transition-colors text-neutral-950 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                处理中... ({completedCount}/{files.length})
              </>
            ) : (
              <>
                开始批量处理 ({files.length} 张)
              </>
            )}
          </button>

          {completedCount > 0 && (
            <button
              onClick={handleDownloadAll}
              disabled={isProcessing}
              className="px-6 py-4 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 rounded-xl transition-colors font-medium flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              下载全部 ({completedCount})
            </button>
          )}
        </div>
      )}

      {/* 统计信息 */}
      {(completedCount > 0 || errorCount > 0) && (
        <div className="flex items-center gap-6 text-sm">
          {completedCount > 0 && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-4 h-4" />
              成功 {completedCount} 张
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              失败 {errorCount} 张
            </div>
          )}
        </div>
      )}
    </div>
  );
}
