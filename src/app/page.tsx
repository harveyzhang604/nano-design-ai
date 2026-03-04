"use client";
import { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Send, Loader2, Download, History, 
  Palette, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { mainDomains, domainCategoriesMap, designCategories, promptTemplates } from '../config/templates';

// 懒加载图标
const Camera = lazy(() => import('lucide-react').then(mod => ({ default: mod.Camera })));
const Layers = lazy(() => import('lucide-react').then(mod => ({ default: mod.Layers })));
const Home = lazy(() => import('lucide-react').then(mod => ({ default: mod.Home })));
const Package = lazy(() => import('lucide-react').then(mod => ({ default: mod.Package })));
const Smartphone = lazy(() => import('lucide-react').then(mod => ({ default: mod.Smartphone })));
const Paintbrush = lazy(() => import('lucide-react').then(mod => ({ default: mod.Paintbrush })));
const Award = lazy(() => import('lucide-react').then(mod => ({ default: mod.Award })));
const Box = lazy(() => import('lucide-react').then(mod => ({ default: mod.Box })));
const Building2 = lazy(() => import('lucide-react').then(mod => ({ default: mod.Building2 })));
const Sparkles = lazy(() => import('lucide-react').then(mod => ({ default: mod.Sparkles })));
const FileText = lazy(() => import('lucide-react').then(mod => ({ default: mod.FileText })));
const BookOpen = lazy(() => import('lucide-react').then(mod => ({ default: mod.BookOpen })));
const Coffee = lazy(() => import('lucide-react').then(mod => ({ default: mod.Coffee })));
const TrendingUp = lazy(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })));
const Film = lazy(() => import('lucide-react').then(mod => ({ default: mod.Film })));
const Share2 = lazy(() => import('lucide-react').then(mod => ({ default: mod.Share2 })));
const Presentation = lazy(() => import('lucide-react').then(mod => ({ default: mod.Presentation })));
const BarChart = lazy(() => import('lucide-react').then(mod => ({ default: mod.BarChart })));
const Atom = lazy(() => import('lucide-react').then(mod => ({ default: mod.Atom })));
const Clock = lazy(() => import('lucide-react').then(mod => ({ default: mod.Clock })));
const Map = lazy(() => import('lucide-react').then(mod => ({ default: mod.Map })));
const UtensilsCrossed = lazy(() => import('lucide-react').then(mod => ({ default: mod.UtensilsCrossed })));
const Plane = lazy(() => import('lucide-react').then(mod => ({ default: mod.Plane })));
const Dumbbell = lazy(() => import('lucide-react').then(mod => ({ default: mod.Dumbbell })));
const Megaphone = lazy(() => import('lucide-react').then(mod => ({ default: mod.Megaphone })));
const ShoppingCart = lazy(() => import('lucide-react').then(mod => ({ default: mod.ShoppingCart })));
const Building = lazy(() => import('lucide-react').then(mod => ({ default: mod.Building })));
const Calendar = lazy(() => import('lucide-react').then(mod => ({ default: mod.Calendar })));
const Gamepad2 = lazy(() => import('lucide-react').then(mod => ({ default: mod.Gamepad2 })));
const Music = lazy(() => import('lucide-react').then(mod => ({ default: mod.Music })));

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
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-700/50 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Nano Design AI</h1>
                <p className="text-sm text-neutral-200">AI 驱动的纳米级设计生成器</p>
              </div>
            </div>
            <Link 
              href="/gallery"
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>作品集</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 应用领域选择 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-200 mb-4">应用领域</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <Suspense fallback={<div className="h-24 bg-neutral-800 rounded-lg animate-pulse" />}>
              {domains.map((d) => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.id}
                    onClick={() => handleDomainChange(d.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      domain === d.id
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-neutral-700 bg-neutral-800/50 text-neutral-200 hover:border-neutral-600'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{d.name}</div>
                  </button>
                );
              })}
            </Suspense>
          </div>
        </section>

        {/* 分类选择 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-200 mb-4">分类选择</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Suspense fallback={<div className="h-20 bg-neutral-800 rounded-lg animate-pulse" />}>
              {currentCategories.map((cat: any) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setSelectedTemplate(null);
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      category === cat.id
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-neutral-700 bg-neutral-800/50 text-neutral-200 hover:border-neutral-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{cat.name}</div>
                  </button>
                );
              })}
            </Suspense>
          </div>
        </section>

        {/* 提示词模板 */}
        {currentTemplates.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-neutral-200">提示词模板</h2>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {showTemplates ? '收起' : '展开'}
              </button>
            </div>
            {showTemplates && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentTemplates.map((template: any) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                    }`}
                  >
                    <div className="font-medium text-neutral-200 mb-1">{template.name}</div>
                    <div className="text-sm text-neutral-200 mb-2">{template.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-neutral-700 text-neutral-200 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 设计需求输入 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-200 mb-4">设计需求</h2>
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想要的设计，例如：一个现代简约风格的 logo，使用蓝色和白色..."
              className="w-full h-32 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-neutral-200">
                {prompt.length} / 1000 字符
              </span>
              <button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>生成中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>生成设计</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* 错误提示 */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-red-200">{error}</div>
          </div>
        )}

        {/* 预览区域 */}
        {resultImage && (
          <section>
            <h2 className="text-xl font-semibold text-neutral-200 mb-4">生成结果</h2>
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-6">
              <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden mb-4">
                <img
                  src={resultImage}
                  alt="Generated Design"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>下载图片</span>
                </button>
                <button
                  onClick={() => setResultImage(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>重新生成</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-700/50 bg-neutral-900/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-neutral-200">
            <p>© 2026 Nano Design AI. Powered by Gemini 2.0 Flash.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DesignPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>}>
      <DesignPageContent />
    </Suspense>
  );
}
