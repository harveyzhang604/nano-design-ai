"use client";
import { useState } from 'react';
import { ArrowLeft, Copy, Check, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import promptsData from '../../../prompts-final.json';

interface Prompt {
  title: string;
  prompt: string;
  tags: string[];
}

interface Category {
  name: string;
  prompts: Prompt[];
}

interface PromptsData {
  categories: {
    [key: string]: Category;
  };
}

const data = promptsData as PromptsData;

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // 获取所有分类
  const categories = [
    { id: 'all', name: '全部' },
    ...Object.entries(data.categories).map(([id, cat]) => ({
      id,
      name: cat.name
    }))
  ];

  // 获取所有提示词
  const allPrompts = Object.entries(data.categories).flatMap(([catId, cat]) =>
    cat.prompts.map((prompt, idx) => ({
      ...prompt,
      category: catId,
      categoryName: cat.name,
      id: `${catId}-${idx}`
    }))
  );

  // 过滤提示词
  const filteredPrompts = allPrompts.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyPrompt = (id: string, prompt: string) => {
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
            <p className="text-neutral-400 text-sm">
              精选 {allPrompts.length} 个 Nano Banana Pro 提示词 · 覆盖 {Object.keys(data.categories).length} 个分类
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
            placeholder="搜索提示词、标签..."
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
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-6">
        <p className="text-neutral-400 text-sm">
          找到 <span className="text-amber-400 font-medium">{filteredPrompts.length}</span> 个提示词
        </p>
      </div>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((item) => (
            <div
              key={item.id}
              className="group bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300"
            >
              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-neutral-100 group-hover:text-amber-400 transition-colors flex-1">
                    {item.title}
                  </h3>
                  <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-md whitespace-nowrap ml-2">
                    {item.categoryName}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-md">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <div className="relative">
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-4 mb-4">
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
                      href={`/?prompt=${encodeURIComponent(item.prompt)}&category=${item.category}`}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      使用
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-lg mb-2">未找到匹配的提示词</p>
            <p className="text-neutral-400 text-sm">尝试调整搜索关键词或选择其他分类</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-800 text-center text-neutral-400 text-sm">
        <p>所有案例基于 Nano Banana Pro (Gemini 3 Pro Image) 生成</p>
        <p className="mt-2 text-xs">提示词来源：AIxploria, Imagine.art, Atlabs AI, nanaimg.io</p>
      </footer>
    </div>
  );
}
