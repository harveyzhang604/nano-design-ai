"use client";
import { useState } from 'react';
import { ArrowLeft, Copy, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Cyberpunk Coffee Shop',
    prompt: 'A translucent glass robot barista pouring latte art inside a cozy, cyberpunk coffee shop. Macro close-up shot, shallow depth of field (f/1.8), illuminated by neon pink and teal signage reflection. Cinematic 8k render, Octane render style. The robot\'s chest display reads "WAKE UP" in bold LCD font.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    tags: ['Cyberpunk', 'Interior', 'Neon', 'Robot']
  },
  {
    id: '2',
    title: 'Minimalist Movie Poster',
    prompt: 'Create a minimalist movie poster for a thriller titled "THE SILENT ECHO". The text should be large, distressed sans-serif font at the top. The visual is a lone cabin in a snowy forest viewed from above. High contrast black and white. Ensure the title is perfectly legible and centered.',
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    tags: ['Poster', 'Typography', 'Minimalist', 'Black & White']
  },
  {
    id: '3',
    title: 'Elaichi Chai Infographic',
    prompt: 'Generate a step-by-step infographic showing how to make Elaichi Chai. Use the model\'s world knowledge to include accurate ingredients like cardamom pods, loose tea leaves, and milk. Style: Clean vector art with pastel colors. Label the ingredients correctly.',
    category: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
    tags: ['Infographic', 'Educational', 'Vector', 'Food']
  },
  {
    id: '4',
    title: 'Tokyo Street Market',
    prompt: 'A bustling street market scene in Tokyo. Neon signs are visible. Generate a billboard in the background that says "Fresh Start" written in Japanese Kanji. Cyberpunk aesthetic, volumetric fog.',
    category: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
    tags: ['Tokyo', 'Cyberpunk', 'Street', 'Neon']
  },
  {
    id: '5',
    title: 'Chess Set Fire & Ice',
    prompt: 'A crystalline chess set where the pieces are made of freezing water and the board is made of burning lava. The pieces are melting slightly where they touch the board. Macro photography, hyper-realistic. Reason through the lighting interactions between fire and ice before generating.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80',
    tags: ['Surreal', 'Macro', 'Fire', 'Ice']
  },
  {
    id: '6',
    title: 'Victorian Detective Office',
    prompt: 'A cluttered detective\'s desk in the 1940s: a steaming cup of coffee on the left, a magnifying glass resting on a newspaper in the center, and a silhouette of a man visible through the frosted glass door in the background. Film noir aesthetic, dramatic lighting.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    tags: ['Film Noir', 'Vintage', '1940s', 'Detective']
  },
  {
    id: '7',
    title: 'Modern Minimalist Living Room',
    prompt: 'A modern minimalist living room with large floor-to-ceiling windows, natural light streaming in, Scandinavian furniture with clean lines, indoor plants, neutral color palette with warm wood accents. Wide angle shot, architectural photography style.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80',
    tags: ['Minimalist', 'Scandinavian', 'Interior', 'Natural Light']
  },
  {
    id: '8',
    title: 'Futuristic Fashion Editorial',
    prompt: 'High fashion editorial photograph of a model wearing a holographic metallic dress with geometric patterns. Studio lighting with colored gels creating purple and blue tones. Vogue magazine style, shot on medium format camera, shallow depth of field.',
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    tags: ['Fashion', 'Editorial', 'Futuristic', 'Holographic']
  },
  {
    id: '9',
    title: 'Sustainable Architecture',
    prompt: 'A modern eco-friendly building with vertical gardens covering the facade, solar panels on the roof, large glass windows, surrounded by lush greenery. Golden hour lighting, architectural photography, drone perspective.',
    category: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?w=800&q=80',
    tags: ['Eco-Friendly', 'Green Architecture', 'Sustainable', 'Modern']
  },
  {
    id: '10',
    title: 'Water Cycle Infographic',
    prompt: 'High-quality flat lay photography creating a DIY infographic that simply explains how the water cycle works, arranged on a clean, light gray textured background. Use simple icons and arrows to show evaporation, condensation, precipitation, and collection.',
    category: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    tags: ['Educational', 'Infographic', 'Science', 'Flat Lay']
  },
  {
    id: '11',
    title: 'Luxury Brand Logo Mockup',
    prompt: 'A photo of a glossy magazine cover, the minimal blue cover has the large bold words "NANO BANANA". The text is in a serif font and fills the view. No other text. In front of the text there is a portrait of a person in a sleek and minimal style.',
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    tags: ['Branding', 'Magazine', 'Typography', 'Luxury']
  },
  {
    id: '12',
    title: 'Cozy Bookstore Interior',
    prompt: 'A warm and inviting independent bookstore interior with floor-to-ceiling wooden bookshelves, vintage leather armchairs, warm Edison bulb lighting, a small coffee bar in the corner. Cozy atmosphere, golden hour light filtering through large windows.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
    tags: ['Bookstore', 'Cozy', 'Vintage', 'Warm Lighting']
  }
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'fashion', name: '服装设计' },
    { id: 'architecture', name: '建筑设计' },
    { id: 'interior', name: '室内设计' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleCopyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors mb-6"
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
              精选 Nano Banana Pro 热门提示词与案例 · 点击复制提示词开始创作
            </p>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
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
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-neutral-100 mb-2 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Prompt */}
                <div className="relative">
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mb-3">
                    {item.prompt}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyPrompt(item.id, item.prompt)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          复制提示词
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
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
        <p>所有案例基于 Nano Banana Pro (Gemini 3 Pro Image) 生成</p>
        <p className="mt-2 text-xs">提示词来源：Google DeepMind 官方文档 & Atlabs AI 社区</p>
      </footer>
    </div>
  );
}
