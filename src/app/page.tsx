import { useState } from 'react';
import { Camera, Layers, PenTool, Send, Loader2, Download, History, Palette } from 'lucide-react';

export default function DesignPage() {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('fashion');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const categories = [
    { id: 'fashion', name: '服装设计', icon: Layers },
    { id: 'architecture', name: '建筑设计', icon: PenTool },
    { id: 'interior', name: '室内设计', icon: Palette },
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    try {
      // 实际调用 Nano Banana 2 (Gemini 3 Pro Image) 的逻辑会在这里
      // 目前作为演示，模拟生成过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      // 模拟返回一个占位图
      setResultImage(`https://placehold.co/1024x1024/222/white?text=${encodeURIComponent(category + ": " + prompt)}`);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-center border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
            Nano Design AI
          </h1>
          <p className="text-neutral-400 mt-2">基于 Nano Banana 2 的专业设计助手</p>
        </div>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <History className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <Camera className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 控制面板 */}
        <aside className="lg:col-span-4 space-y-8">
          <section>
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">设计分类</h3>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    category === cat.id 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <cat.icon className={`w-6 h-6 mb-2 ${category === cat.id ? 'text-amber-400' : 'text-neutral-400'}`} />
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">设计需求</h3>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述您的设计灵感，例如：现代主义风格的极简住宅，大面积落地窗，周围环绕着森林..."
                className="w-full h-48 bg-neutral-900 border border-neutral-800 rounded-xl p-4 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all resize-none text-sm leading-relaxed"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full mt-4 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  立即生成
                </>
              )}
            </button>
          </section>
        </aside>

        {/* 预览窗口 */}
        <section className="lg:col-span-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl aspect-square overflow-hidden flex items-center justify-center relative group">
            {resultImage ? (
              <>
                <img 
                  src={resultImage} 
                  alt="Generated Design" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-neutral-950/80 backdrop-blur text-white p-3 rounded-full hover:bg-neutral-800">
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-neutral-600" />
                </div>
                <h2 className="text-xl font-medium text-neutral-400">准备就绪</h2>
                <p className="text-neutral-600 mt-2 max-w-xs">在左侧输入您的设计创意，元宝将为您即刻呈现视觉效果。</p>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                  <p className="text-amber-200 font-medium">Nano Banana 2 正在构思您的设计...</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
