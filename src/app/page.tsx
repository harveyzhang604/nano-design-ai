"use client";
import { useState } from 'react';
import { Camera, Layers, PenTool, Send, Loader2, Download, History, Palette, AlertCircle } from 'lucide-react';

export default function DesignPage() {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('fashion');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'fashion', name: '服装设计', icon: Layers },
    { id: 'architecture', name: '建筑设计', icon: PenTool },
    { id: 'interior', name: '室内设计', icon: Palette },
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '生成失败，请检查配置或稍后再试。');
      }

      setResultImage(data.imageUrl);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nano-design-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 selection:bg-amber-500/30">
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-center border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-neutral-950 text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            🪙
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
              Nano Design AI
            </h1>
            <p className="text-neutral-400 mt-0.5 text-xs font-medium tracking-tight uppercase">POWERED BY NANO BANANA 2</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-white border border-transparent hover:border-neutral-700">
            <History className="w-5 h-5" />
          </button>
          <button className="p-2.5 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-white border border-transparent hover:border-neutral-700">
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 控制面板 */}
        <aside className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <section>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">设计领域</h3>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                    category === cat.id 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.08)]' 
                      : 'bg-neutral-900/50 border-neutral-800/50 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <cat.icon className={`w-6 h-6 mb-2 ${category === cat.id ? 'text-amber-400' : 'text-neutral-400'}`} />
                  <span className="text-[10px] font-bold">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">设计需求 / Prompt</h3>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述您的设计灵感，例如：现代主义风格的极简住宅，大面积落地窗，周围环绕着森林..."
                className="w-full h-56 bg-neutral-900 border border-neutral-800 rounded-xl p-5 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all resize-none text-sm leading-relaxed placeholder:text-neutral-700 group-hover:border-neutral-700 shadow-inner"
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-neutral-600 font-mono">
                {prompt.length} chars
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 items-start text-red-400 text-xs animate-in zoom-in-95 duration-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full mt-6 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:from-neutral-800 disabled:to-neutral-900 disabled:text-neutral-600 text-neutral-950 font-black text-sm uppercase tracking-widest py-5 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-amber-500/10"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  构思中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  生成设计方案
                </>
              )}
            </button>
          </section>
        </aside>

        {/* 预览窗口 */}
        <section className="lg:col-span-8 animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-3xl aspect-[4/3] overflow-hidden flex items-center justify-center relative group shadow-2xl backdrop-blur-sm">
            {resultImage ? (
              <>
                <img 
                  src={resultImage} 
                  alt="Generated Design" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-8 right-8 flex gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button 
                    onClick={handleDownload}
                    className="bg-amber-500 text-neutral-950 p-4 rounded-2xl hover:bg-amber-400 shadow-xl active:scale-90 transition-all"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-12 max-w-sm">
                <div className="w-24 h-24 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl relative">
                  <Camera className="w-10 h-10 text-neutral-700" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-200">开始您的创作</h2>
                <p className="text-neutral-500 mt-4 text-sm leading-relaxed">
                  在左侧面板选择您的设计领域并输入创意描述。元宝将使用 **Nano Banana 2** 引擎为您生成高清渲染图。
                </p>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center z-50">
                <div className="text-center px-6">
                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <Palette className="absolute inset-0 m-auto w-8 h-8 text-amber-500" />
                  </div>
                  <p className="text-amber-200 font-bold text-lg tracking-tight">AI 正在进行像素级渲染...</p>
                  <p className="text-amber-500/50 text-[10px] mt-2 font-mono uppercase tracking-[0.3em]">Nano Banana Engine v2.0</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
             <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Architecture</h4>
                <p className="text-xs text-neutral-400 italic font-serif">"Architecture starts where engineering ends."</p>
             </div>
             <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Fashion</h4>
                <p className="text-xs text-neutral-400 italic font-serif">"Design is intelligence made visible."</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
