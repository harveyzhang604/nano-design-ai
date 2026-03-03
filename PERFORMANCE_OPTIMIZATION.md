# Nano Design AI - 性能优化计划

## Lighthouse 跑分结果 (2026-03-03)

- **性能 (Performance)**: 82/100 ✅ 
- **无障碍 (Accessibility)**: 93/100 ⚠️
- **最佳实践 (Best Practices)**: 100/100 ✅
- **SEO**: 100/100 ✅

## 主要问题

### 1. 性能问题 (Performance: 82 → 目标 90+)

**问题：**
- JavaScript 太重，主线程阻塞 520ms
- LCP (最大内容绘制): 2.8s (目标 < 2.5s)

**优化方案：**
- [ ] 代码分割：懒加载非关键组件
- [ ] 字体优化：使用 `font-display: swap`
- [ ] 图片优化：使用 Next.js Image 组件
- [ ] 减少初始 JavaScript 包大小
- [ ] 预加载关键资源

### 2. 无障碍问题 (Accessibility: 93 → 目标 100)

**问题：**
- 颜色对比度不足
- 标题层级不规范

**优化方案：**
- [ ] 修复低对比度文本（neutral-400 → neutral-300）
- [ ] 修复标题结构（h1 → h2 → h3 语义化）
- [ ] 添加 ARIA 标签
- [ ] 确保所有交互元素可键盘访问

## 优化实施

### Phase 1: 无障碍修复 (Quick Wins)

#### 1.1 颜色对比度修复

**当前问题区域：**
```tsx
// 对比度不足的文本
text-neutral-400  // 需要改为 text-neutral-300
text-neutral-500  // 需要改为 text-neutral-400
text-neutral-600  // 需要改为 text-neutral-500
```

**修复清单：**
- [ ] Header 副标题
- [ ] 分类描述文本
- [ ] 提示词模板标签
- [ ] 字符计数器
- [ ] Footer 文本

#### 1.2 标题层级修复

**当前问题：**
```tsx
<h1>Nano Design AI</h1>
<h3>应用领域</h3>  // ❌ 跳过了 h2
<h3>设计领域</h3>  // ❌ 跳过了 h2
```

**修复后：**
```tsx
<h1>Nano Design AI</h1>
<h2>应用领域</h2>  // ✅ 正确层级
<h2>设计领域</h2>  // ✅ 正确层级
```

### Phase 2: 性能优化

#### 2.1 代码分割

**懒加载组件：**
```tsx
// 懒加载 Gallery 链接图标
const ImageIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Image })), {
  loading: () => <div className="w-5 h-5" />
});

// 懒加载模板展开区域
const TemplateSection = dynamic(() => import('@/components/TemplateSection'), {
  loading: () => <div>Loading...</div>
});
```

#### 2.2 字体优化

**next.config.js:**
```js
module.exports = {
  optimizeFonts: true,
  experimental: {
    optimizeCss: true
  }
}
```

**globals.css:**
```css
@font-face {
  font-display: swap; /* 避免 FOIT */
}
```

#### 2.3 减少初始包大小

**策略：**
- 移除未使用的 Lucide 图标
- 使用 tree-shaking
- 压缩 JSON 配置文件

### Phase 3: 高级优化

#### 3.1 预加载关键资源

```tsx
<link rel="preload" href="/fonts/..." as="font" crossOrigin="anonymous" />
<link rel="preconnect" href="https://generativelanguage.googleapis.com" />
```

#### 3.2 图片优化

```tsx
// 使用 Next.js Image 组件
import Image from 'next/image';

<Image 
  src={resultImage} 
  alt="Generated Design"
  width={1200}
  height={900}
  priority
  quality={85}
/>
```

#### 3.3 CSS 优化

- 移除未使用的 Tailwind 类
- 使用 PurgeCSS
- 压缩 CSS

## 实施顺序

1. **Day 1 (今天)**: 无障碍修复
   - 颜色对比度 (30 分钟)
   - 标题层级 (15 分钟)
   - 测试验证 (15 分钟)

2. **Day 2**: 性能优化 Phase 1
   - 代码分割 (1 小时)
   - 字体优化 (30 分钟)

3. **Day 3**: 性能优化 Phase 2
   - 图片优化 (30 分钟)
   - CSS 优化 (30 分钟)
   - 最终测试 (30 分钟)

## 预期结果

**优化后目标：**
- Performance: 82 → **92+**
- Accessibility: 93 → **100**
- Best Practices: 100 (保持)
- SEO: 100 (保持)

**关键指标改善：**
- LCP: 2.8s → **< 2.0s**
- 主线程阻塞: 520ms → **< 300ms**
- 首次内容绘制 (FCP): 改善 20%+

---

**创建时间**: 2026-03-03 16:45  
**负责人**: 火山  
**优先级**: P0 (高)
