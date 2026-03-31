'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, Download, ChevronLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

type StepStatus = 'pending' | 'running' | 'completed' | 'failed';

interface StepResult {
  status: StepStatus;
  imageUrl?: string;
  error?: string;
}

export default function OldPhotoRestorePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Record<number, StepResult>>({
    1: { status: 'pending' },
    2: { status: 'pending' },
    3: { status: 'pending' },
  });
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateStep = (n: number, data: Partial<StepResult>) =>
    setSteps(prev => ({ ...prev, [n]: { ...prev[n], ...data } }));

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setGlobalError('请上传图片文件'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      setOriginalImage(e.target?.result as string);
      setGlobalError(null);
      setDone(false);
      setSteps({ 1: { status: 'pending' }, 2: { status: 'pending' }, 3: { status: 'pending' } });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const runStep = async (stepNum: number, imageUrl: string): Promise<string> => {
    updateStep(stepNum, { status: 'running' });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180000); // 3分钟超时
    try {
      const res = await fetch('/api/restore-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, step: stepNum }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `步骤${stepNum}失败`);
      updateStep(stepNum, { status: 'completed', imageUrl: data.imageUrl });
      return data.imageUrl;
    } catch (err: any) {
      if (err.name === 'AbortError') throw new Error(`步骤${stepNum}超时，请重试（图片较大时处理较慢）`);
      throw err;
    } finally {
      clearTimeout(timer);
    }
  };

  const startProcess = async () => {
    if (!originalImage || isProcessing) return;
    setIsProcessing(true);
    setGlobalError(null);
    setDone(false);
    setSteps({ 1: { status: 'pending' }, 2: { status: 'pending' }, 3: { status: 'pending' } });
    try {
      const r1 = await runStep(1, originalImage);
      const r2 = await runStep(2, r1);
      await runStep(3, r2);
      setDone(true);
    } catch (err: any) {
      setGlobalError(err.message || '处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const download = (url: string, label: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `restore-${label}.png`;
    a.click();
  };

  const reset = () => {
    setOriginalImage(null);
    setDone(false);
    setGlobalError(null);
    setIsProcessing(false);
    setSteps({ 1: { status: 'pending' }, 2: { status: 'pending' }, 3: { status: 'pending' } });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const stepConfig = [
    { n: 1, name: '第 1 次修复', desc: '清除划痕、污渍、折痕', tag: 'repair', headerCls: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800', borderCls: 'border-blue-200 dark:border-blue-800', titleCls: 'text-blue-700 dark:text-blue-300', btnCls: 'bg-blue-600 hover:bg-blue-700', iconCls: 'text-blue-500' },
    { n: 2, name: '第 2 次修复', desc: '恢复发丝、服装、背景纹理', tag: 'detail', headerCls: 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800', borderCls: 'border-purple-200 dark:border-purple-800', titleCls: 'text-purple-700 dark:text-purple-300', btnCls: 'bg-purple-600 hover:bg-purple-700', iconCls: 'text-purple-500' },
    { n: 3, name: '第 3 次修复', desc: '最终润饰，统一色调质感', tag: 'polish', headerCls: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700', borderCls: 'border-green-300 dark:border-green-700', titleCls: 'text-green-700 dark:text-green-300', btnCls: 'bg-green-600 hover:bg-green-700', iconCls: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/tools" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">老照片智能修复</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">三步顺序修复 · 每步结果实时可见 · 逐张下载</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {globalError && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {globalError}
          </div>
        )}

        {/* Upload area */}
        {!originalImage ? (
          <div className="max-w-2xl mx-auto">
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">点击或拖拽上传老照片</p>
              <p className="text-sm text-gray-500">支持 JPG、PNG、WEBP、HEIC，最大 20MB</p>
            </div>
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3">修复流程说明</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>🔵 <strong>第1次</strong>：清除划痕、污渍、折痕等物理损伤</p>
                <p>🟣 <strong>第2次</strong>：恢复发丝、服装纹理、背景细节（面部区域锁定不改变）</p>
                <p>🟢 <strong>第3次</strong>：最终润饰，统一整体色调与质感</p>
                <p className="text-gray-400 pt-1">每步完成后立即显示结果，全程可见，逐张下载</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 操作按钮栏 */}
            <div className="flex items-center gap-4 mb-6 max-w-6xl mx-auto">
              {!isProcessing && !done && (
                <button onClick={startProcess} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl text-lg transition-colors shadow-lg">
                  开始三步修复
                </button>
              )}
              {isProcessing && (
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-medium">AI 修复中，请勿关闭页面...</span>
                </div>
              )}
              {done && (
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-green-600 dark:text-green-400 font-semibold">✅ 三步修复全部完成！</p>
                  {steps[3].imageUrl && (
                    <button onClick={() => download(steps[3].imageUrl!, 'final')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg transition-colors">
                      <Download className="w-4 h-4" /> 下载最终结果
                    </button>
                  )}
                  <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 underline">修复另一张照片</button>
                </div>
              )}
              {!done && !isProcessing && (
                <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 underline">重新选择照片</button>
              )}
            </div>

            {/* 第一行：原始照片 + 第三次修复 */}
            <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-center font-semibold text-gray-700 dark:text-gray-200">原始照片</p>
                </div>
                <div className="p-3">
                  <img src={originalImage} alt="原图" className="w-full h-auto rounded" />
                </div>
              </div>
              {/* 第三次修复 */}
              {(() => {
                const s3 = steps[3];
                const cfg3 = stepConfig[2];
                return (
                  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 ${ s3.status === 'completed' ? cfg3.borderCls : 'border-gray-200 dark:border-gray-700' }`}>
                    <div className={`p-3 border-b ${ s3.status === 'completed' ? cfg3.headerCls : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' }`}>
                      <p className={`text-center font-semibold ${ s3.status === 'completed' ? cfg3.titleCls : 'text-gray-500 dark:text-gray-400' }`}>{cfg3.name} · 最终结果</p>
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cfg3.desc}</p>
                    </div>
                    <div className="p-3">
                      {s3.status === 'completed' && s3.imageUrl ? (
                        <>
                          <img src={s3.imageUrl} alt="第3次修复" className="w-full h-auto rounded" />
                          <button onClick={() => download(s3.imageUrl!, cfg3.tag)} className={`mt-2 w-full ${cfg3.btnCls} text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors`}>
                            <Download className="w-4 h-4" /> 下载
                          </button>
                        </>
                      ) : s3.status === 'running' ? (
                        <div className="aspect-square flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                          <p className="text-sm text-gray-500">AI 处理中...</p>
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center gap-3">
                          <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                          <p className="text-sm text-gray-400">等待前两步完成</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 第二行：第一次 + 第二次修复 */}
            <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
              {stepConfig.filter(({ n }) => n !== 3).map(({ n, name, desc, tag, headerCls, borderCls, titleCls, btnCls, iconCls }) => {
                const s = steps[n];
                const active = s.status === 'completed';
                return (
                  <div key={n} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 ${ active ? borderCls : 'border-gray-200 dark:border-gray-700' }`}>
                    <div className={`p-3 border-b ${ active ? headerCls : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${ active ? titleCls : 'text-gray-400 dark:text-gray-500' }`}>{name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                        </div>
                        {s.status === 'pending' && <Clock className="w-5 h-5 text-gray-300" />}
                        {s.status === 'running' && <Loader2 className={`w-5 h-5 ${iconCls} animate-spin`} />}
                        {s.status === 'completed' && <CheckCircle className={`w-5 h-5 ${iconCls}`} />}
                        {s.status === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                    </div>
                    <div className="p-4">
                      {s.status === 'pending' && (
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <p className="text-gray-400 text-sm">等待中...</p>
                        </div>
                      )}
                      {s.status === 'running' && (
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center gap-3">
                          <Loader2 className={`w-10 h-10 ${iconCls} animate-spin`} />
                          <p className="text-sm text-gray-500">AI 修复中...</p>
                        </div>
                      )}
                      {s.status === 'completed' && s.imageUrl && (
                        <>
                          <img src={s.imageUrl} alt={name} className="w-full h-auto rounded-lg mb-3" />
                          {n === 3 && (
                            <div className="mb-2 text-center">
                              <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">最终结果</span>
                            </div>
                          )}
                          <button
                            onClick={() => download(s.imageUrl!, tag)}
                            className={`w-full ${btnCls} text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors`}
                          >
                            <Download className="w-4 h-4" /> 下载{name}
                          </button>
                        </>
                      )}
                      {s.status === 'failed' && (
                        <div className="aspect-square bg-red-50 dark:bg-red-900/20 rounded-lg flex flex-col items-center justify-center gap-2 p-4">
                          <XCircle className="w-10 h-10 text-red-400" />
                          <p className="text-sm text-red-600 dark:text-red-400 text-center">{s.error || '修复失败'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
