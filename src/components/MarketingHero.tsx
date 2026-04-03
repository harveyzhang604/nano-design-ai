// 营销优化组件 - 价格对比和核心优势
// components/MarketingHero.tsx

export function PriceComparison() {
  return (
    <div className="max-w-7xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
            完全免费，永远免费
          </span>
        </h2>
        <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto">
          不要订阅疲劳，不要隐藏费用，只要真实自然的 AI 图像处理
        </p>
      </div>

      {/* 价格对比表 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center hover:border-neutral-700 transition-colors">
          <div className="text-sm text-neutral-300 mb-2">PhotoRoom</div>
          <div className="text-3xl font-bold text-red-400">$9.99</div>
          <div className="text-xs text-neutral-400 mt-1">/月</div>
          <div className="text-xs text-neutral-500 mt-2">订阅制</div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center hover:border-neutral-700 transition-colors">
          <div className="text-sm text-neutral-300 mb-2">Remove.bg</div>
          <div className="text-3xl font-bold text-red-400">$0.20</div>
          <div className="text-xs text-neutral-400 mt-1">/张</div>
          <div className="text-xs text-neutral-500 mt-2">按次付费</div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center hover:border-neutral-700 transition-colors">
          <div className="text-sm text-neutral-300 mb-2">Adobe</div>
          <div className="text-3xl font-bold text-red-400">$54.99</div>
          <div className="text-xs text-neutral-400 mt-1">/月</div>
          <div className="text-xs text-neutral-500 mt-2">强制订阅</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-center relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-shadow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] opacity-50"></div>
          <div className="relative">
            <div className="text-sm text-neutral-900 font-bold mb-2">Nano Design AI</div>
            <div className="text-4xl font-black text-neutral-950">$0</div>
            <div className="text-xs text-neutral-900 mt-1 font-bold">永久免费</div>
            <div className="text-xs text-neutral-900 mt-2 font-semibold">✨ 无限使用</div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-neutral-400">
          💡 省下订阅费，喝杯咖啡不香吗？
        </p>
      </div>
    </div>
  );
}

export function CoreValues() {
  const values = [
    {
      icon: '💰',
      title: '完全免费',
      description: '无需订阅，无需注册，无限次数使用。告别订阅疲劳，告别隐藏费用。',
      comparison: 'PhotoRoom $9.99/月 · Adobe $54.99/月',
      highlight: '节省 $120+/年'
    },
    {
      icon: '✨',
      title: '真实自然',
      description: '不要塑料皮肤，不要假完美。保留你的个性和灵魂，真实感优先。',
      comparison: 'Remini 过度平滑 · 其他工具塑料感',
      highlight: '保留真实纹理'
    },
    {
      icon: '🎭',
      title: '不改变你',
      description: '老照片修复不改变表情，人像增强不改变面部。只让你更清晰，不让你变成另一个人。',
      comparison: 'Remini 改变面部 · AI 过度修改',
      highlight: '保守修复理念'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">为什么选择我们？</h2>
        <p className="text-neutral-400">基于 50+ 用户真实反馈，我们解决了 AI 图像处理的三大痛点</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <div 
            key={index}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] group"
          >
            <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-500/20 transition-colors">
              <span className="text-3xl">{value.icon}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors">
              {value.title}
            </h3>
            
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              {value.description}
            </p>
            
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <div>
                <div className="text-xs text-neutral-500 mb-1">竞品对比</div>
                <div className="text-sm text-neutral-300">{value.comparison}</div>
              </div>
              
              <div className="inline-block px-3 py-1 bg-amber-500/10 rounded-full">
                <span className="text-xs font-semibold text-amber-400">
                  ✓ {value.highlight}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-4">
          <p className="text-sm text-neutral-300">
            <span className="text-amber-400 font-bold">真实、自然、有温度</span> 的 AI 图像处理
          </p>
        </div>
      </div>
    </div>
  );
}

export function SocialProof() {
  const testimonials = [
    {
      text: "终于不是塑料脸了！保留了我的皮肤纹理和真实感。",
      author: "小红书用户 @设计师小王",
      tag: "真实自然",
      rating: 5
    },
    {
      text: "老照片修复没有改变我祖父的表情，太感动了。这才是真正的修复。",
      author: "Reddit 用户",
      tag: "保守修复",
      rating: 5
    },
    {
      text: "完全免费还这么好用，已经推荐给所有朋友了。省下的订阅费够喝一年咖啡了。",
      author: "微博用户 @摄影爱好者",
      tag: "完全免费",
      rating: 5
    }
  ];

  return (
    <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">用户真实评价</h2>
        <p className="text-neutral-400">来自 Reddit、小红书、微博的真实反馈</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-center gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-amber-400">★</span>
              ))}
            </div>
            
            <p className="text-neutral-300 text-sm leading-relaxed mb-4">
              "{testimonial.text}"
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <div className="text-xs text-neutral-500">
                {testimonial.author}
              </div>
              <div className="px-2 py-1 bg-amber-500/10 rounded-full">
                <span className="text-xs font-semibold text-amber-400">
                  {testimonial.tag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
