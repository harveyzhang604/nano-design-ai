"use client";
import { useState, useEffect, Suspense } from 'react';
import { 
  Camera, Layers, Send, Loader2, Download, History, 
  Palette, AlertCircle, Image as ImageIcon, Home, Package, 
  Smartphone, Paintbrush, Award, Box, Building2, Sparkles,
  FileText, BookOpen, Coffee, TrendingUp, Film,
  Share2, Presentation, BarChart, Atom, Clock, Map,
  UtensilsCrossed, Plane, Dumbbell, Megaphone, ShoppingCart,
  Building, Calendar, Gamepad2, Music
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { mainDomains, domainCategoriesMap, designCategories, promptTemplates } from '../config/templates';

function DesignPageContent() {
  const searchParams = useSearchParams();
  const [domain, setDomain] = useState('design');
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('fashion');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 从 URL 参数加载提示词
  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    const urlCategory = searchParams.get('category');
    if (urlPrompt) setPrompt(urlPrompt);
    if (urlCategory) setCategory(urlCategory);
  }, [searchParams]);

  const iconMap: Record<string, any> = {
    Layers, Building2, Home, Package, Palette, Smartphone, Paintbrush, Award, Camera, Box,
    FileText, BookOpen, Coffee, TrendingUp, Film, Share2, Presentation, BarChart, Atom,
    Clock, Map, UtensilsCrossed, Plane, Dumbbell, Megaphone, ShoppingCart, Building,
    Calendar, Gamepad2, Music, Sparkles
  };

  const domains = mainDomains.map(d => ({
    ...d,
    icon: iconMap[d.icon] || Palette
  }));

  const currentCategories = (domainCategoriesMap[domain] || designCategories).map((cat: any) => ({
    ...cat,
    icon: iconMap[cat.icon] || Layers
  }));

  const currentTemplates = promptTemplates[category as keyof typeof promptTemplates] || [];

  const handleDomainChange = (newDomain: string) => {
    setDomain(newDomain);
    const firstCategory = domainCategoriesMap[newDomain]?.[0]?.id || 'fashion';
    setCategory(firstCategory);
    setSelectedTemplate(null);
  };

  const handleTemplateSelect = (template: any) => {
    setPrompt(template.prompt);
    setSelectedTemplate(template.id);
    setShowTemplates(false);
  };

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
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-neutral-950 text-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            🪙
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
              Nano Design AI
            </h1>
            <p className="text-neutral-300 mt-0.5 text-xs font-medium tracking-tight uppercase">POWERED BY NANO BANANA 2</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/gallery"
            className="p-2.5 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-300 hover:text-white border border-transparent hover:border-neutral-700"
            title="查看灵感画廊"
            aria-label="查看灵感画廊"
          >
            <ImageIcon className="w-5 h-5" aria-hidden="true" />
          </Link>
          <button 
            className="p-2.5 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-300 hover:text-white border border-transparent hover:border-neutral-700"
            aria-label="查看历史记录"
            title="查看历史记录"
          >
            <History className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Social Proof - 用户统计 */}
      <div className="max-w-7xl mx-auto mb-12 animate-in fade-in slide-in-from-top duration-500">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                20K+
              </div>
              <div className="text-xs text-neutral-300 uppercase tracking-wider">活跃用户</div>
            </div>
            <div className="space-y-1 border-x border-amber-500/20">
              <div className="text-3xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                1000+
              </div>
              <div className="text-xs text-neutral-300 uppercase tracking-wider">图片/小时</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                99%
              </div>
              <div className="text-xs text-neutral-300 uppercase tracking-wider">好评率</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12" role="main">
        {/* 控制面板 */}
        <aside className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-left duration-700" role="complementary" aria-label="设计控制面板">
          {/* 领域选择 */}
          <section aria-labelledby="domain-heading">
            <h2 id="domain-heading" className="text-xs font-semibold text-neutral-300 uppercase tracking-[0.2em] mb-4">应用领域</h2>
            <div className="grid grid-cols-2 gap-3">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDomainChange(d.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                    domain === d.id 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.08)]' 
                      : 'bg-neutral-900/50 border-neutral-800/50 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                  title={d.description}
                >
                  <d.icon className={`w-5 h-5 mb-2 ${domain === d.id ? 'text-amber-400' : 'text-neutral-300'}`} />
                  <span className="text-[10px] font-bold text-center">{d.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 分类选择 */}
          <section aria-labelledby="category-heading">
            <h2 id="category-heading" className="text-xs font-semibold text-neutral-300 uppercase tracking-[0.2em] mb-4">
              {domains.find(d => d.id === domain)?.name || '设计领域'}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {currentCategories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    setSelectedTemplate(null);
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                    category === cat.id 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.08)]' 
                      : 'bg-neutral-900/50 border-neutral-800/50 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                  title={cat.description}
                >
                  <cat.icon className={`w-5 h-5 mb-2 ${category === cat.id ? 'text-amber-400' : 'text-neutral-300'}`} />
                  <span className="text-[10px] font-bold text-center">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 提示词模板 */}
          <section aria-labelledby="template-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="template-heading" className="text-xs font-semibold text-neutral-300 uppercase tracking-[0.2em]">提示词模板</h2>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-xs text-amber-400 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {showTemplates ? '收起' : '展开'}
              </button>
            </div>
            
            {showTemplates && (
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {currentTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTemplate === template.id
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : 'bg-neutral-900/50 border-neutral-800/50 hover:border-neutral-700'
                    }`}
                  >
                    <div className="font-medium text-sm text-neutral-200 mb-1">{template.name}</div>
                    <div className="text-xs text-neutral-300 line-clamp-2">{template.prompt}</div>
                    <div className="flex gap-1 mt-2">
                      {template.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="prompt-heading">
            <h2 id="prompt-heading" className="text-xs font-semibold text-neutral-300 uppercase tracking-[0.2em] mb-4">设计需求 / Prompt</h2>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述您的创作灵感，或从上方选择模板开始..."
                className="w-full h-56 bg-neutral-900 border border-neutral-800 rounded-xl p-5 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all resize-none text-sm leading-relaxed placeholder:text-neutral-700 group-hover:border-neutral-700 shadow-inner"
                aria-label="输入设计需求描述"
                aria-describedby="char-count"
              />
              <div id="char-count" className="absolute bottom-4 right-4 text-[10px] text-neutral-300 font-mono" aria-live="polite">
                {prompt.length} chars
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 items-start text-red-400 text-xs animate-in zoom-in-95 duration-300" role="alert" aria-live="assertive">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full mt-6 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:from-neutral-800 disabled:to-neutral-900 disabled:text-neutral-400 text-neutral-950 font-black text-base uppercase tracking-widest py-6 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] disabled:shadow-none relative overflow-hidden group"
              aria-label={isGenerating ? "正在生成中" : "立即免费生成"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="relative">AI 构思中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span className="relative">立即免费生成</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-neutral-400 mt-3">
              ⚡ 平均生成时间 &lt;30秒 · 无需注册 · 完全免费
            </p>
          </section>
        </aside>

        {/* 预览窗口 */}
        <section className="lg:col-span-8 animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-3xl aspect-[4/3] overflow-hidden flex items-center justify-center relative group shadow-2xl backdrop-blur-sm">
            {resultImage ? (
              <>
                <img 
                  src={resultImage} 
                  alt="AI生成的设计作品" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
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
                <p className="text-neutral-300 mt-4 text-sm leading-relaxed">
                  选择应用领域和分类，使用提示词模板或自定义描述。元宝将使用 **Nano Banana 2** 引擎为您生成高清图像。
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
        </section>
      </main>

      {/* 用户评价 - Testimonials */}
      <section className="max-w-7xl mx-auto mt-20 mb-12 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-neutral-200 mb-2">用户评价</h2>
          <p className="text-neutral-400 text-sm">来自真实用户的反馈</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400">★</span>
              ))}
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed mb-4">
              "生成速度超快，质量也很高！作为设计师，这个工具大大提升了我的工作效率。"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-neutral-950 font-bold">
                李
              </div>
              <div>
                <div className="text-neutral-200 text-sm font-medium">李明</div>
                <div className="text-neutral-500 text-xs">UI 设计师</div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400">★</span>
              ))}
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed mb-4">
              "模板非常丰富，涵盖了各种场景。对于不懂设计的人来说非常友好！"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-neutral-950 font-bold">
                王
              </div>
              <div>
                <div className="text-neutral-200 text-sm font-medium">王芳</div>
                <div className="text-neutral-500 text-xs">市场运营</div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400">★</span>
              ))}
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed mb-4">
              "完全免费还这么好用，简直是宝藏工具！已经推荐给团队所有人了。"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-neutral-950 font-bold">
                张
              </div>
              <div>
                <div className="text-neutral-200 text-sm font-medium">张伟</div>
                <div className="text-neutral-500 text-xs">创业者</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(38, 38, 38, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5);
        }
      `}</style>
    </div>
  );
}

export default function DesignPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center"><div className="text-amber-400">Loading...</div></div>}>
      <DesignPageContent />
    </Suspense>
  );
}
