"use client";
import { useState } from 'react';
import { ArrowLeft, Copy, Check, ExternalLink, Search } from '../../components/icons';
import Link from 'next/link';
import Image from 'next/image';
import galleryData from '../../data/gallery.json';

interface GalleryItem {
  id: number;
  prompt: string;
  imageUrl: string;
}

const data = galleryData as GalleryItem[];

// 根据提示词关键词自动分类
function categorizeItem(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('fashion') || lower.includes('服装')) return 'fashion';
  if (lower.includes('architecture') || lower.includes('建筑')) return 'architecture';
  if (lower.includes('interior') || lower.includes('空间')) return 'interior';
  if (lower.includes('product') || lower.includes('产品')) return 'product';
  if (lower.includes('ui') || lower.includes('app') || lower.includes('website')) return 'ui';
  if (lower.includes('logo') || lower.includes('brand') || lower.includes('poster')) return 'branding';
  if (lower.includes('illustration') || lower.includes('character')) return 'illustration';
  if (lower.includes('3d') || lower.includes('render')) return '3d';
  if (lower.includes('photography') || lower.includes('photo')) return 'photography';
  return 'other';
}

const categories = [
  { id: 'all', name: '全部', color: 'amber' },
  { id: 'fashion', name: '时尚', color: 'pink' },
  { id: 'architecture', name: '建筑', color: 'blue' },
  { id: 'interior', name: '室内', color: 'green' },
  { id: 'product', name: '产品', color: 'purple' },
  { id: 'ui', name: 'UI设计', color: 'cyan' },
  { id: 'branding', name: '品牌', color: 'orange' },
  { id: 'illustration', name: '插画', color: 'rose' },
  { id: '3d', name: '3D', color: 'indigo' },
  { id: 'photography', name: '摄影', color: 'teal' },
  { id: 'other', name: '其他', color: 'gray' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 为每个项目添加分类
  const itemsWithCategory = data.map(item => ({
    ...item,
    category: categorizeItem(item.prompt)
  }));

  // 过滤图片
  const filteredItems = itemsWithCategory.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyPrompt = (id: number, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-neutral-300 hover:text-amber-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
        
        <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent mb-2">
              灵感画廊
            </h1>
            <p className="text-neutral-300 text-sm">
              {data.length} 张 AI 生成作品 · Gemini 3.1 Flash Image
            </p>
          </div>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="搜索提示词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-6">
        <p className="text-neutral-300 text-sm">
          找到 <span className="text-amber-400 font-medium">{filteredItems.length}</span> 张图片
        </p>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-neutral-800">
                <Image
                  src={item.imageUrl}
                  alt={item.prompt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Prompt */}
                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3 mb-4">
                  {item.prompt}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyPrompt(item.id, item.prompt)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg transition-colors"
                  >
                    {copiedIndex === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        复制
                      </>
                    )}
                  </button>
                  <Link
                    href={`/?prompt=${encodeURIComponent(item.prompt)}`}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    使用
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-300 text-lg mb-2">未找到匹配的图片</p>
            <p className="text-neutral-300 text-sm">尝试调整搜索关键词或选择其他分类</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-800 text-center text-neutral-300 text-sm">
        <p>所有图片由 Gemini 3.1 Flash Image 生成</p>
      </footer>
    </div>
  );
}
