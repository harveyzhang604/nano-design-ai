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
  { id: 'style-transfer-pro', name: '风格迁移Pro', icon: Paintbrush, color: 'from-purple-500 to-fuchsia-500', desc: '10种艺术风格可调节', category: 'P1' },
  { id: 'avatar', name: 'AI头像', icon: Smile, color: 'from-rose-500 to-pink-500', desc: '生成风格化头像', category: 'P1' },
  { id: 'cartoon', name: '卡通化', icon: PartyPopper, color: 'from-orange-500 to-amber-500', desc: '照片转动漫风格', category: 'P1' },
  { id: 'caricature', name: '职业漫画化', icon: Smile, color: 'from-amber-500 to-orange-500', desc: '12种职业漫画风格', category: 'P1' },
  { id: 'yearbook', name: '年鉴照', icon: Camera, color: 'from-indigo-500 to-purple-500', desc: '70s-00s复古年鉴风', category: 'P1' },
  { id: 'sketch-to-photo', name: '草图转照片', icon: Grid, color: 'from-slate-500 to-zinc-500', desc: '手绘草图真实化', category: 'P1' },
  { id: 'product', name: '产品摄影', icon: Monitor, color: 'from-emerald-500 to-green-500', desc: '电商产品展示图', category: 'P1' },
  { id: 'face-swap', name: 'AI换脸', icon: User, color: 'from-red-500 to-orange-500', desc: '替换照片人脸', category: 'P1' },
  { id: 'outfit-change', name: 'AI换装', icon: Shirt, color: 'from-violet-500 to-purple-500', desc: '虚拟试穿不同服装', category: 'P1' },
  { id: 'try-on', name: '虚拟试穿', icon: Shirt, color: 'from-blue-500 to-indigo-500', desc: 'AI试穿衣服', category: 'P1' },
  { id: 'beauty-enhance', name: '人像美化', icon: Sparkles, color: 'from-pink-500 to-rose-500', desc: '自然美颜可调节', category: 'P1' },
  { id: 'object-remove', name: '物体移除Pro', icon: Eraser, color: 'from-red-500 to-orange-500', desc: '智能填充边缘羽化', category: 'P1' },
  { id: 'interior', name: '室内设计', icon: Home, color: 'from-amber-500 to-yellow-500', desc: '房间装修效果图', category: 'P1' },
  { id: 'age', name: '年龄模拟', icon: Baby, color: 'from-teal-500 to-cyan-500', desc: '预测年轻/老年容貌', category: 'P1' },
  { id: 'face-age', name: '脸龄生成', icon: Contrast, color: 'from-rose-400 to-pink-600', desc: '童年未来长相', category: 'P1' },
  
  // P2 - 有趣功能
  { id: 'meme', name: '表情包', icon: Calculator, color: 'from-yellow-400 to-amber-600', desc: '文字生成表情包', category: 'P2' },
  { id: 'greeting', name: '生日贺卡', icon: Heart, color: 'from-pink-400 to-rose-500', desc: 'AI定制贺卡', category: 'P2' },
  { id: 'pet-cartoon', name: '宠物卡通化', icon: Heart, color: 'from-pink-500 to-rose-500', desc: '宠物变卡通+拟人化', category: 'P2' },
  { id: 'cosplay', name: 'Cosplay', icon: Sparkles, color: 'from-purple-400 to-fuchsia-500', desc: 'AI生成Cos照片', category: 'P2' },
  { id: 'photoshoot', name: 'AI写真', icon: Camera, color: 'from-cyan-400 to-blue-500', desc: '个人AI写真集', category: 'P2' },
  { id: 'real-estate', name: '房产渲染', icon: MapPin, color: 'from-green-400 to-emerald-600', desc: '装修前后对比', category: 'P2' },
  { id: 'map-gen', name: '地图生成', icon: Map, color: 'from-sky-400 to-blue-600', desc: '文字描述生成地图', category: 'P2' },
  { id: 'fashion', name: '服装模特', icon: Shirt, color: 'from-fuchsia-400 to-pink-600', desc: '虚拟模特展示', category: 'P2' },
  { id: 'compose', name: '图像合成', icon: Layers, color: 'from-slate-400 to-zinc-500', desc: '多图融合蒙版', category: 'P2' },
];

function ToolCard({ tool, onClick }: { tool: typeof tools[0], onClick: () => void }) {
  // 使用 Nano Banana Pro 生成的真实示例图片
  const exampleImage = `/${tool.id}-example.webp`;
  
  return (
    <button
      onClick={onClick}
      className="group bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden text-left transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
    >
      {/* 示例图片 - Nano Banana Pro 生成的真实对比图 */}
      <div className="relative h-32 bg-neutral-800 overflow-hidden">
        <img 
          src={exampleImage}
          alt={`${tool.name} 效果对比`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src.endsWith('.webp')) img.src = `/${tool.id}-example.png`;
          }}
        />
      </div>
      
      {/* 工具信息 - 图标和文字同一行 */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <tool.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors truncate">
              {tool.name}
            </h3>
            <p className="text-xs text-neutral-400 truncate">{tool.desc}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            tool.category === 'P0' ? 'bg-red-500/20 text-red-400' :
            tool.category === 'P1' ? 'bg-amber-500/20 text-amber-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {tool.category}
          </span>
          <span className="text-[10px] text-neutral-500 group-hover:text-amber-400 transition-colors flex items-center gap-1">
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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [toolParams, setToolParams] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTool = tools.find(t => t.id === activeTool);

  const handleParamsChange = (params: Record<string, any>) => {
    setToolParams(params);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 图像合成：支持多图上传
    if (activeTool === 'compose') {
      const readers = files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve((ev.target?.result as string) || '');
            reader.readAsDataURL(file);
          })
      );

      Promise.all(readers).then((results) => {
        const valid = results.filter(Boolean);
        setUploadedImages((prev) => [...prev, ...valid].slice(0, 6)); // 最多6张
        if (valid[0]) setUploadedImage(valid[0]); // 兼容旧逻辑
      });
      return;
    }

    // 其他工具：单图上传
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
      setUploadedImages([]);
    };
    reader.readAsDataURL(file);
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
      'style-transfer': '/api/style-transfer',
      'style-transfer-pro': '/api/style-transfer-pro',
      'avatar': '/api/avatar',
      'cartoon': '/api/cartoon',
      'caricature': '/api/caricature',
      'yearbook': '/api/yearbook',
      'sketch-to-photo': '/api/sketch-to-image',
      'product': '/api/product-photo',
      'face-swap': '/api/face-swap',
      'outfit-change': '/api/outfit-change',
      'beauty-enhance': '/api/beauty-enhance',
      'object-remove': '/api/object-remove',
      'interior': '/api/interior-design',
      'age': '/api/age-transform',
      'face-age': '/api/age-transform',
      'meme': '/api/meme',
      'greeting': '/api/greeting-card',
      'pet-cartoon': '/api/pet-cartoon',
      'cosplay': '/api/cosplay',
      'photoshoot': '/api/photoshoot',
      'real-estate': '/api/real-estate',
      'map-gen': '/api/map-gen',
      'fashion': '/api/fashion-model',
      'try-on': '/api/try-on',
      'makeup': '/api/makeup',
      'tattoo': '/api/tattoo',
      'gender-swap': '/api/gender-swap',
      'hairstyle': '/api/hairstyle',
      'filter': '/api/filter',
      'baby-prediction': '/api/baby-prediction',
      'compose': '/api/compose',
    };
    return endpoints[toolId] || '/api/generate';
  };

  // 获取工具的默认 prompt（用于 /api/generate fallback）
  const getDefaultPrompt = (toolId: string): string => {
    const prompts: Record<string, string> = {
      'cartoon': '将照片转换为动漫/卡通风格，保持人物特征自然',
      'cosplay': '生成角色扮演主题的照片效果',
      'try-on': '虚拟试穿效果，自然真实',
      'real-estate': '房产渲染，室内装修效果图',
      'map-gen': '根据描述生成地图场景',
    };
    return prompts[toolId] || '请处理这张图片';
  };

  const handleProcess = async () => {
    if (!activeTool) return;
    if (activeTool === 'compose' && uploadedImages.length < 2) {
      alert('图像合成请至少上传 2 张图片');
      return;
    }
    if (activeTool !== 'compose' && !uploadedImage) return;
    
    setIsProcessing(true);
    setResultImage(null);
    
    try {
      const endpoint = getApiEndpoint(activeTool);
      
      // 构建请求体，包含用户选择的参数
      const requestBody: any = activeTool === 'compose'
        ? {
            prompt: `请把这 ${uploadedImages.length} 张图片做自然无缝合成，主体边缘干净，光影一致，结果真实。`,
            imageUrls: uploadedImages,
            ...toolParams
          }
        : {
            imageUrl: uploadedImage,
            prompt: getDefaultPrompt(activeTool),
            ...toolParams
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
    setUploadedImage(null);
    setUploadedImages([]);
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
            31 个强大 AI 功能，涵盖图像处理、创意生成、社交娱乐等场景
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
              <span className="text-xs text-neutral-500 font-normal ml-2">12 个功能</span>
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
              <span className="text-xs text-neutral-500 font-normal ml-2">11 个功能</span>
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
                  {activeTool === 'compose' ? '上传图片（可多选）' : '上传图片'}
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    (activeTool === 'compose' ? uploadedImages.length > 0 : !!uploadedImage)
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
                  }`}
                >
                  {activeTool === 'compose' ? (
                    uploadedImages.length > 0 ? (
                      <div>
                        <div className="grid grid-cols-3 gap-3">
                          {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img src={img} alt={`Uploaded ${idx + 1}`} className="h-24 w-full object-cover rounded-lg" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/80 text-white text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-amber-400 mt-3">已上传 {uploadedImages.length} 张（至少 2 张）</p>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Upload className="w-12 h-12 mx-auto text-neutral-500 mb-4" />
                        <p className="text-neutral-400 mb-2">点击或拖拽上传多张图片</p>
                        <p className="text-xs text-neutral-500">支持 JPG、PNG，最多 6 张，单张最大 10MB</p>
                      </div>
                    )
                  ) : uploadedImage ? (
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
                  multiple={activeTool === 'compose'}
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
                disabled={isProcessing || (activeTool === 'compose' ? uploadedImages.length < 2 : !uploadedImage)}
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
