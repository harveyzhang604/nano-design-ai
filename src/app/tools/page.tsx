"use client";
import { useState, useRef } from 'react';
import { 
  Image, Palette, Eraser, ZoomIn, Paintbrush, User, 
  Wand2, Sparkles, Download, Upload, Loader2, 
  Scissors, RefreshCw, Smile, Baby, Filter, Layers,
  Shirt, Home, MapPin, Calculator, PartyPopper,
  Heart, Wand, SunMedium, Contrast, Crop, RotateCw,
  FlipHorizontal, Type, Grid, Monitor, Smartphone, Camera, Map
} from '@/components/icons';
import ToolParams from './components/ToolParams';
import { toolConfigs } from './configs';
import { toolExamples } from './examples';

// 功能列表
const tools = [
  // P0 - 紧急开发
  { id: 'remove-bg', name: '背景移除', icon: Scissors, color: 'from-blue-500 to-cyan-500', desc: '一键去除背景', category: 'P0' },
  { id: 'upscale', name: '照片放大', icon: ZoomIn, color: 'from-purple-500 to-pink-500', desc: '2x/4x/8x无损放大', category: 'P0' },
  { id: 'colorize', name: '照片上色', icon: Palette, color: 'from-yellow-500 to-orange-500', desc: '黑白照片智能上色', category: 'P0' },
  { id: 'restore', name: '老照片修复', icon: RefreshCw, color: 'from-amber-500 to-red-500', desc: '修复划痕模糊破损', category: 'P0' },
  { id: 'erase', name: 'AI去物体', icon: Eraser, color: 'from-green-500 to-emerald-500', desc: '移除不需要的元素', category: 'P0' },
  { id: 'change-bg', name: 'AI换背景', icon: Layers, color: 'from-indigo-500 to-blue-500', desc: '替换任意场景背景', category: 'P0' },
  { id: 'portrait', name: '人像增强', icon: User, color: 'from-pink-500 to-rose-500', desc: '磨皮美白瘦脸大眼', category: 'P0' },
  { id: 'enhance', name: '图像超分', icon: Wand2, color: 'from-cyan-500 to-teal-500', desc: '提升画质增强细节', category: 'P0' },
  
  // P1 - 重要功能
  { id: 'style-transfer', name: '艺术风格', icon: Paintbrush, color: 'from-violet-500 to-purple-500', desc: '油画水彩漫画风格', category: 'P1' },
  { id: 'avatar', name: 'AI头像', icon: Smile, color: 'from-rose-500 to-pink-500', desc: '生成风格化头像', category: 'P1' },
  { id: 'cartoon', name: '卡通化', icon: PartyPopper, color: 'from-orange-500 to-amber-500', desc: '照片转动漫风格', category: 'P1' },
  { id: 'sketch-to-photo', name: '草图转照片', icon: Grid, color: 'from-slate-500 to-zinc-500', desc: '手绘草图真实化', category: 'P1' },
  { id: 'product', name: '产品摄影', icon: Monitor, color: 'from-emerald-500 to-green-500', desc: '电商产品展示图', category: 'P1' },
  { id: 'face-swap', name: 'AI换脸', icon: User, color: 'from-red-500 to-orange-500', desc: '替换照片人脸', category: 'P1' },
  { id: 'try-on', name: '虚拟试穿', icon: Shirt, color: 'from-blue-500 to-indigo-500', desc: 'AI试穿衣服', category: 'P1' },
  { id: 'interior', name: '室内设计', icon: Home, color: 'from-amber-500 to-yellow-500', desc: '房间装修效果图', category: 'P1' },
  { id: 'age', name: '年龄模拟', icon: Baby, color: 'from-teal-500 to-cyan-500', desc: '预测年轻/老年容貌', category: 'P1' },
  { id: 'face-age', name: '脸龄生成', icon: Contrast, color: 'from-rose-400 to-pink-600', desc: '童年未来长相', category: 'P1' },
  
  // P2 - 有趣功能
  { id: 'meme', name: '表情包', icon: Calculator, color: 'from-yellow-400 to-amber-600', desc: '文字生成表情包', category: 'P2' },
  { id: 'greeting', name: '生日贺卡', icon: Heart, color: 'from-pink-400 to-rose-500', desc: 'AI定制贺卡', category: 'P2' },
  { id: 'cosplay', name: 'Cosplay', icon: Sparkles, color: 'from-purple-400 to-fuchsia-500', desc: 'AI生成Cos照片', category: 'P2' },
  { id: 'photoshoot', name: 'AI写真', icon: Camera, color: 'from-cyan-400 to-blue-500', desc: '个人AI写真集', category: 'P2' },
  { id: 'real-estate', name: '房产渲染', icon: MapPin, color: 'from-green-400 to-emerald-600', desc: '装修前后对比', category: 'P2' },
  { id: 'map-gen', name: '地图生成', icon: Map, color: 'from-sky-400 to-blue-600', desc: '文字描述生成地图', category: 'P2' },
  { id: 'fashion', name: '服装模特', icon: Shirt, color: 'from-fuchsia-400 to-pink-600', desc: '虚拟模特展示', category: 'P2' },
  { id: 'compose', name: '图像合成', icon: Layers, color: 'from-slate-400 to-zinc-500', desc: '多图融合蒙版', category: 'P2' },
];

function ToolCard({ tool, onClick }: { tool: typeof tools[0], onClick: () => void }) {
  const example = toolExamples[tool.id as keyof typeof toolExamples];
  
  return (
    <button
      onClick={onClick}
      className="group bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden text-left transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
    >
      {/* 示例图片 - Before/After 对比 */}
      {example && (
        <div className="relative h-40 bg-neutral-800 overflow-hidden">
          {/* Before 图片（左半部分） */}
          <div className="absolute inset-0 w-1/2 left-0">
            <img 
              src={example.before} 
              alt={`${tool.name} 处理前`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-neutral-900/80 text-white text-xs rounded">
              处理前
            </div>
          </div>
          
          {/* After 图片（右半部分） */}
          <div className="absolute inset-0 w-1/2 right-0">
            <img 
              src={example.after} 
              alt={`${tool.name} 处理后`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-neutral-950 text-xs rounded font-bold">
              处理后
            </div>
          </div>
          
          {/* 中间分割线 */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50"></div>
        </div>
      )}
      
      {/* 工具信息 */}
      <div className="p-6">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <tool.icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-neutral-400">{tool.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${
            tool.category === 'P0' ? 'bg-red-500/20 text-red-400' :
            tool.category === 'P1' ? 'bg-amber-500/20 text-amber-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {tool.category}
          </span>
          <span className="text-xs text-neutral-500 group-hover:text-amber-400 transition-colors flex items-center gap-1">
            立即体验 →
          </span>
        </div>
      </div>
    </button>
  );
}

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [toolParams, setToolParams] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTool = tools.find(t => t.id === activeTool);

  const handleParamsChange = (params: Record<string, any>) => {
    setToolParams(params);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 根据工具 ID 获取对应的 API 端点
  const getApiEndpoint = (toolId: string): string => {
    const endpoints: Record<string, string> = {
      'remove-bg': '/api/remove-bg',
      'upscale': '/api/upscale',
      'colorize': '/api/colorize',
      'restore': '/api/restore',
      'erase': '/api/erase',
      'change-bg': '/api/change-bg',
      'portrait': '/api/portrait',
      'enhance': '/api/enhance',
    };
    return endpoints[toolId] || '/api/generate';
  };

  const handleProcess = async () => {
    if (!uploadedImage || !activeTool) return;
    
    setIsProcessing(true);
    setResultImage(null);
    
    try {
      const endpoint = getApiEndpoint(activeTool);
      
      // 构建请求体，包含用户选择的参数
      const requestBody: any = { 
        imageUrl: uploadedImage,
        ...toolParams  // 添加用户选择的参数
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '处理失败');
      }

      setResultImage(data.imageUrl);
    } catch (error: any) {
      console.error('Processing error:', error);
      alert('处理失败: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
    setResultImage(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-neutral-950" />
              </div>
              <span className="text-xl font-bold">Nano Design AI</span>
            </a>
            <span className="text-neutral-500">/</span>
            <span className="text-lg font-semibold">功能中心</span>
          </div>
          <a 
            href="/" 
            className="text-sm text-neutral-400 hover:text-amber-400 transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            🎨 <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AI 图像工具箱</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            26+ 强大 AI 功能，涵盖图像处理、创意生成、社交娱乐等场景
          </p>
        </div>

        {/* 功能卡片网格 */}
        <div className="space-y-12">
          {/* P0 - 紧急开发 */}
          <section>
            <h2 className="text-xl font-6-bold mb flex items-center gap-3">
              <span className="w-2 h-8 bg-red-500 rounded-full"></span>
              P0 - 热门功能
              <span className="text-xs text-neutral-500 font-normal ml-2">8 个功能</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools.filter(t => t.category === 'P0').map(tool => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={() => handleToolClick(tool.id)} 
                />
              ))}
            </div>
          </section>

          {/* P1 - 重要功能 */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
              P1 - 实用功能
              <span className="text-xs text-neutral-500 font-normal ml-2">10 个功能</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools.filter(t => t.category === 'P1').map(tool => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={() => handleToolClick(tool.id)} 
                />
              ))}
            </div>
          </section>

          {/* P2 - 有趣功能 */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full"></span>
              P2 - 创意玩法
              <span className="text-xs text-neutral-500 font-normal ml-2">8 个功能</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools.filter(t => t.category === 'P2').map(tool => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={() => handleToolClick(tool.id)} 
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 功能处理面板 */}
      {activeTool && currentTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* 面板头部 */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTool.color} flex items-center justify-center`}>
                  <currentTool.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentTool.name}</h3>
                  <p className="text-sm text-neutral-400">{currentTool.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTool(null)}
                className="text-neutral-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* 面板内容 */}
            <div className="p-6">
              {/* 上传区域 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  上传图片
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    uploadedImage 
                      ? 'border-amber-500 bg-amber-500/10' 
                      : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
                  }`}
                >
                  {uploadedImage ? (
                    <div className="relative">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="max-h-64 mx-auto rounded-xl"
                      />
                      <p className="text-sm text-amber-400 mt-2">点击更换图片</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="w-12 h-12 mx-auto text-neutral-500 mb-4" />
                      <p className="text-neutral-400 mb-2">点击或拖拽上传图片</p>
                      <p className="text-xs text-neutral-500">支持 JPG、PNG 格式，最大 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* 参数调节面板 */}
              {activeTool && toolConfigs[activeTool] && (
                <div className="mb-6">
                  <ToolParams 
                    toolId={activeTool} 
                    onParamsChange={handleParamsChange}
                  />
                </div>
              )}

              {/* 处理按钮 */}
              <button
                onClick={handleProcess}
                disabled={!uploadedImage || isProcessing}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-neutral-700 disabled:to-neutral-800 text-neutral-950 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>处理中...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>开始处理</span>
                  </>
                )}
              </button>

              {/* 结果展示 */}
              {resultImage && (
                <div className="mt-6 p-4 bg-neutral-800/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-300">处理结果</span>
                    <button className="text-amber-400 text-sm flex items-center gap-1 hover:text-amber-300">
                      <Download className="w-4 h-4" />
                      下载图片
                    </button>
                  </div>
                  <img 
                    src={resultImage} 
                    alt="Result" 
                    className="w-full rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
