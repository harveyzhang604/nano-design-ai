# 实施路线图 - AI 图像功能优化

**制定时间**: 2026-03-11  
**项目**: nano-design-ai  
**目标**: 基于市场趋势优化现有功能，新增病毒式传播功能

---

## 🎯 总体目标

### 短期目标（1 个月）
- ✅ 优化 5 个现有功能的 prompt
- ✅ 新增 2 个病毒式传播功能
- ✅ 提升生成速度和质量
- ✅ 用户留存率提升 15-20%

### 中期目标（3 个月）
- 建立"最快 AI 图像生成"品牌认知
- 月活用户增长 30-50%
- 付费转化率提升 10%
- 完善用户反馈循环

### 长期目标（6 个月）
- 成为中文市场 Top 3 AI 图像工具
- 建立用户社区和 UGC 内容
- 探索 B2B 市场机会
- 实现盈利平衡

---

## 📅 Phase 1: 立即优化（第 1 周）

### 优先级 P0 - 立即执行

#### 1.1 优化 Italian Brainrot 功能
**文件**: `/src/app/api/italian-gesture/route.ts`

**当前状态**: ✅ API 端点已存在

**优化内容**:
```typescript
// 更新 prompt 模板
const optimizedPrompt = `
Transform this photo into an Italian Brainrot baroque portrait in the style of 17th century Italian masters.

STYLE ELEMENTS:
- Dramatic Caravaggio-style chiaroscuro lighting (strong contrast)
- Rich Renaissance-era clothing: velvet doublet with gold embroidery, lace collar
- Exaggerated Italian hand gestures: fingers pinched together, raised dramatically
- Ornate baroque background: classical architecture, marble columns
- Oil painting texture with visible brushstrokes
- Slightly surreal and uncanny aesthetic
- Operatic drama and intensity
- Museum-quality portrait from 1600s Italy

TECHNICAL SPECS:
- Maintain facial features and recognizability
- Rich color palette: deep reds, golds, dark shadows
- High detail in fabric textures and jewelry

OUTPUT: A dramatic baroque portrait with surreal modern twist.
`;

// 更新参数
const params = {
  temperature: 0.7,  // 增加创意性
  topK: 40,
  topP: 0.95,
};
```

**测试标准**:
- [ ] 巴洛克风格明显（光影对比强烈）
- [ ] 手势夸张且符合意大利文化
- [ ] 服装细节丰富（天鹅绒、蕾丝、金饰）
- [ ] 整体有"超现实"感
- [ ] 生成时间 < 10 秒

**预期效果**: 提升 TikTok/Instagram 分享率 30%

---

#### 1.2 优化 Enhance 功能 - 添加"自然风格"
**文件**: `/src/app/api/enhance/route.ts`

**当前状态**: ✅ API 端点已存在

**优化内容**:
```typescript
// 添加 style 参数
interface EnhanceRequest {
  image: string;
  style?: 'natural' | 'professional' | 'dramatic';  // 新增
}

// 自然风格 prompt
const naturalPrompt = `
Enhance this photo with natural, authentic improvements.

ENHANCEMENT GOALS:
- Subtle color correction (balanced, not oversaturated)
- Gentle lighting adjustment (natural, not dramatic)
- Preserve skin texture and natural imperfections (pores, freckles, fine lines)
- Maintain film grain if present
- Professional quality without looking "edited"

AVOID:
- Over-smoothing or airbrushing skin
- Removing natural features
- Artificial perfection
- Overly vibrant colors

STYLE: iPhone portrait mode aesthetic, natural light photography

OUTPUT: Professionally enhanced photo that still looks real and authentic.
`;

// 参数调整
const naturalParams = {
  temperature: 0.3,  // 保守增强
  topK: 20,
  topP: 0.85,
};
```

**测试标准**:
- [ ] 保留皮肤纹理（毛孔、雀斑）
- [ ] 颜色自然（不过饱和）
- [ ] 无"塑料感"
- [ ] 看起来像真实照片
- [ ] 用户满意度 > 85%

**预期效果**: 减少"过度美化"投诉 50%

---

#### 1.3 优化 Portrait 功能
**文件**: `/src/app/api/portrait/route.ts`

**优化内容**:
```typescript
const optimizedPortraitPrompt = `
Create a professional portrait with natural, authentic quality.

PORTRAIT STYLE:
- Natural skin texture with visible pores and fine details
- Soft, flattering lighting (not harsh or dramatic)
- Genuine expression and personality
- Professional but approachable feel

LIGHTING:
- Soft window light or studio softbox
- Gentle shadows that define features
- Natural catchlights in eyes
- Even skin tone without over-correction

TECHNICAL SPECS:
- Shallow depth of field (blurred background)
- Sharp focus on eyes
- Natural color grading
- 85mm portrait lens aesthetic

AVOID:
- Plastic or artificial skin
- Over-smoothing
- Unrealistic perfection
- Heavy makeup look (unless requested)

OUTPUT: Professional portrait that looks like skilled photographer work, not AI.
`;
```

**测试标准**:
- [ ] 真实皮肤质感
- [ ] 自然光线效果
- [ ] 眼神清晰有神
- [ ] 背景虚化自然
- [ ] 无 AI 生成痕迹

---

#### 1.4 测试现有热门功能
**测试清单**:
- [ ] `ghibli` - 确保水彩质感和梦幻氛围
- [ ] `chibi` - 确保可爱度和比例正确
- [ ] `pet-humanize` - 确保拟人化自然
- [ ] `cartoon` - 测试是否需要 Pixar 风格变体
- [ ] `yearbook` - 确保复古感和年代准确性

**测试方法**:
1. 每个功能生成 10 张测试图
2. 内部评分（1-5 分）
3. 小范围用户测试（20 人）
4. 收集反馈并迭代

---

## 📅 Phase 2: 新增核心功能（第 2-3 周）

### 优先级 P0 - 高价值功能

#### 2.1 新增 Claymation 功能
**文件**: `/src/app/api/claymation/route.ts`（新建）

**实施步骤**:

**Step 1: 创建 API 端点**
```typescript
// /src/app/api/claymation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiImage } from '@/lib/gemini-image';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    
    const prompt = `
Transform this photo into a claymation/clay figure character in stop-motion animation style.

STYLE ELEMENTS:
- Polymer clay texture with visible fingerprint marks and surface imperfections
- Chunky, slightly exaggerated proportions (larger head, simplified body)
- Matte finish with soft studio lighting (no glossy surfaces)
- Handcrafted, artisanal feel
- Aardman Animations aesthetic (Wallace & Gromit, Shaun the Sheep)
- Slightly uncanny but charming appearance
- Visible seams and joints where clay pieces connect
- Soft shadows and even lighting (stop-motion studio setup)

CHARACTER DESIGN:
- Maintain recognizable facial features
- Simplify details while keeping personality
- Rounded, friendly shapes
- Expressive eyes (slightly larger than realistic)
- Simplified hair texture (clay strands or molded shape)

TECHNICAL SPECS:
- Clean neutral background or simple set piece
- Soft diffused lighting from multiple angles
- No harsh shadows or reflections
- Warm, inviting color palette

OUTPUT: A charming clay figure that looks like it stepped out of a stop-motion animation film.
    `;

    const result = await generateGeminiImage({
      apiKey: process.env.GEMINI_API_KEY!,
      prompt,
      imageBase64: image,
      temperature: 0.5,
      topK: 32,
      topP: 0.9,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ 
      success: true, 
      image: `data:image/png;base64,${result.base64Data}` 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Step 2: 前端集成**
```typescript
// 添加到功能列表
const features = [
  // ... 现有功能
  {
    id: 'claymation',
    name: 'Claymation 黏土风格',
    description: '变身定格动画角色',
    icon: '🎭',
    category: 'style',
    trending: true,  // 标记为热门
  },
];
```

**Step 3: 测试与优化**
- [ ] 生成 20 张测试图
- [ ] 评估黏土质感是否明显
- [ ] 检查角色识别度
- [ ] 调整 temperature（0.4-0.6 范围测试）
- [ ] 用户测试（50 人）

**预期效果**: 
- 成为 Top 3 热门功能
- 社交媒体分享率 > 40%
- 用户留存提升 10%

---

#### 2.2 新增动作手办盒功能
**文件**: `/src/app/api/action-figure/route.ts`（新建）

**实施步骤**:

**Step 1: 创建 API 端点**
```typescript
// /src/app/api/action-figure/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiImage } from '@/lib/gemini-image';

interface ActionFigureRequest {
  image: string;
  name?: string;  // 自定义名称
  accessories?: string[];  // 配件列表
  edition?: 'standard' | 'limited' | 'deluxe';
}

export async function POST(req: NextRequest) {
  try {
    const { image, name = 'Hero', accessories = ['sunglasses', 'phone'], edition = 'limited' } = await req.json();
    
    const accessoriesText = accessories.join(', ');
    const editionText = edition === 'deluxe' ? 'Deluxe Collector\'s Edition' : 
                        edition === 'limited' ? 'Limited Edition Series' : 
                        'Standard Edition';
    
    const prompt = `
Transform this person into a collectible action figure displayed in retail toy packaging.

PACKAGING DESIGN:
- Clear plastic blister pack mounted on colorful cardboard backing
- Product name at top: "${name} Action Figure - ${editionText}"
- Toy company logo (generic collectible brand)
- Barcode, age rating (8+), and product number at bottom
- "Collect them all!" tagline
- Window box showing figure and accessories clearly

FIGURE DETAILS:
- Plastic action figure texture with visible joints (shoulders, elbows, hips, knees)
- Dynamic heroic pose inside packaging
- Slightly stylized proportions (heroic build)
- Painted details and clean sculpt
- 6-inch scale appearance

ACCESSORIES (displayed around figure):
- Include these items: ${accessoriesText}
- Small display stand
- Accessories card with item names
- Collector's certificate (for limited/deluxe editions)

PHOTOGRAPHY STYLE:
- Professional toy photography
- Studio lighting with soft shadows
- Slight reflection on plastic blister
- Vibrant, eye-catching colors
- Hasbro/Mattel quality presentation

TEXT REQUIREMENTS:
- Product name must be clearly readable
- All text should be sharp and legible
- Barcode and labels visible

OUTPUT: A retail-ready action figure package that looks like it belongs on a toy store shelf.
    `;

    const result = await generateGeminiImage({
      apiKey: process.env.GEMINI_API_KEY!,
      prompt,
      imageBase64: image,
      temperature: 0.6,
      topK: 40,
      topP: 0.92,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ 
      success: true, 
      image: `data:image/png;base64,${result.base64Data}` 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Step 2: 前端交互设计**
```typescript
// 添加自定义选项
interface ActionFigureOptions {
  name: string;  // 用户输入名称
  accessories: string[];  // 多选配件
  edition: 'standard' | 'limited' | 'deluxe';  // 版本选择
}

// 配件预设
const accessoryPresets = [
  { id: 'sunglasses', label: '墨镜', icon: '🕶️' },
  { id: 'phone', label: '手机', icon: '📱' },
  { id: 'coffee', label: '咖啡', icon: '☕' },
  { id: 'laptop', label: '笔记本', icon: '💻' },
  { id: 'headphones', label: '耳机', icon: '🎧' },
  { id: 'camera', label: '相机', icon: '📷' },
];
```

**Step 3: 测试重点**
- [ ] 文字渲染清晰度（产品名称）
- [ ] 包装设计真实感
- [ ] 配件显示准确性
- [ ] 自定义名称功能
- [ ] 不同版本差异明显

**预期效果**:
- 独特差异化功能（竞品少有）
- 用户自定义参与度高
- 社交媒体病毒传播潜力大
- 付费转化率提升 15%

---

#### 2.3 优化 Cartoon 为 3D Pixar 风格
**文件**: `/src/app/api/cartoon/route.ts`

**优化内容**:
```typescript
// 添加 style 参数
interface CartoonRequest {
  image: string;
  style?: '2d' | '3d-pixar' | 'comic';  // 新增风格选项
}

// 3D Pixar 风格 prompt
const pixarPrompt = `
Transform this photo into a 3D Pixar/Disney animated character.

CHARACTER DESIGN:
- Rounded, friendly facial features with appealing proportions
- Large expressive eyes with detailed iris and catchlights
- Soft, volumetric hair rendering with individual strand detail
- Smooth skin shader with subtle subsurface scattering
- Slightly exaggerated features for charm and personality
- Family-friendly, all-ages appeal

TECHNICAL RENDERING:
- Pixar's signature 3D rendering quality
- Warm studio lighting with soft shadows
- Slight rim lighting on hair and edges
- Clean, polished look without being overly glossy
- Rich, saturated colors
- Depth of field with soft background blur

STYLE REFERENCES:
- Toy Story character quality
- Coco/Encanto modern Pixar aesthetic
- Inside Out emotional expressiveness
- Turning Red contemporary style

OUTPUT: A character that looks like they belong in a modern Pixar animated feature film.
`;

const pixarParams = {
  temperature: 0.6,
  topK: 35,
  topP: 0.9,
};
```

**测试标准**:
- [ ] 3D 渲染质感明显
- [ ] 眼睛大而有神
- [ ] 头发有体积感
- [ ] 整体"Pixar 感"强烈
- [ ] 与 2D 卡通明显区分

---

## 📅 Phase 3: 增强与差异化（第 4 周）

### 优先级 P1 - 提升竞争力

#### 3.1 添加"生成多变体"功能
**目标**: 一次生成 4-6 个风格变体，提升迭代速度

**实施方案**:
```typescript
// /src/app/api/generate-variants/route.ts
interface VariantsRequest {
  image: string;
  feature: string;  // 功能类型
  count: number;    // 变体数量（2-6）
}

export async function POST(req: NextRequest) {
  const { image, feature, count = 4 } = await req.json();
  
  // 并行生成多个变体
  const variants = await Promise.all(
    Array.from({ length: count }, (_, i) => 
      generateGeminiImage({
        apiKey: process.env.GEMINI_API_KEY!,
        prompt: getPromptForFeature(feature),
        imageBase64: image,
        temperature: 0.6 + (i * 0.1),  // 轻微变化
      })
    )
  );
  
  return NextResponse.json({ 
    success: true, 
    variants: variants.map(v => v.ok ? v.base64Data : null).filter(Boolean)
  });
}
```

**前端展示**:
- 网格布局显示所有变体
- 用户可选择最喜欢的
- 支持"基于此变体再生成"

**预期效果**:
- 用户满意度提升 25%
- 平均使用时长增加 40%
- 付费转化率提升 8%

---

#### 3.2 Web 联网生成（利用 Nano Banana 2 独家功能）
**目标**: 生成包含真实品牌、地标、时事的图片

**实施方案**:
```typescript
// 在 prompt 中添加实时信息
const webGroundedPrompt = `
Generate an image of [subject] at [real location].

REQUIREMENTS:
- Use current, accurate information about [location]
- Include recognizable landmarks and features
- Reflect current appearance (2026)
- Accurate brand logos and products if mentioned

GROUNDING:
- Search for recent images of [location]
- Verify current state and appearance
- Include seasonal/temporal accuracy

OUTPUT: A realistic image grounded in current real-world information.
`;
```

**应用场景**:
- 旅游场景生成（真实地标）
- 产品场景（真实品牌）
- 时事相关内容
- 本地化营销素材

**预期效果**:
- 独特差异化功能
- B2B 市场吸引力
- 品牌合作机会

---

#### 3.3 角色库功能
**目标**: 保存并复用角色，保持一致性

**数据库设计**:
```typescript
interface Character {
  id: string;
  userId: string;
  name: string;
  description: string;  // 详细特征描述
  referenceImage: string;  // 参考图 base64
  createdAt: Date;
  usageCount: number;
}
```

**功能流程**:
1. 用户生成满意的角色
2. 点击"保存为角色"
3. 输入角色名称和描述
4. 后续生成时可选择"使用已保存角色"
5. 系统自动添加角色描述到 prompt

**预期效果**:
- 品牌用户留存率提升 30%
- 系列内容创作者活跃度提升
- 付费订阅吸引力增强

---

## 📅 Phase 4: 数据驱动优化（持续进行）

### 4.1 数据收集与分析

**关键指标**:
```typescript
interface FeatureMetrics {
  featureId: string;
  totalGenerations: number;
  successRate: number;  // 生成成功率
  avgGenerationTime: number;  // 平均生成时间
  userSatisfaction: number;  // 用户评分（1-5）
  shareRate: number;  // 分享到社交媒体比例
  retryRate: number;  // 重新生成比例
  conversionRate: number;  // 付费转化率
}
```

**分析维度**:
1. **功能热度排行** - 哪些功能最受欢迎
2. **质量问题识别** - 哪些功能重试率高
3. **用户流失点** - 哪个环节用户离开
4. **付费转化路径** - 哪些功能带来付费

**优化循环**:
```
数据收集 → 问题识别 → Prompt 优化 → A/B 测试 → 数据验证 → 全量发布
```

---

### 4.2 A/B 测试框架

**测试场景**:
1. **Prompt 版本对比**
   - 版本 A: 当前 prompt
   - 版本 B: 优化后 prompt
   - 指标: 用户满意度、分享率

2. **参数调优**
   - Temperature: 0.5 vs 0.7
   - 指标: 创意性 vs 一致性

3. **功能入口位置**
   - 位置 A: 首页顶部
   - 位置 B: 分类页面
   - 指标: 点击率、转化率

**实施工具**:
```typescript
// 简单 A/B 测试框架
function getPromptVariant(featureId: string, userId: string): string {
  const hash = hashCode(userId);
  const variant = hash % 2;  // 50/50 分流
  
  return variant === 0 
    ? prompts[featureId].variantA 
    : prompts[featureId].variantB;
}
```

---

### 4.3 用户反馈循环

**反馈收集**:
1. **生成后评分** - 1-5 星评分
2. **问题报告** - "不满意"原因选择
3. **功能建议** - 开放式文本输入
4. **社交分享** - 追踪分享行为

**反馈处理流程**:
```
用户反馈 → 分类整理 → 优先级排序 → 技术评估 → 实施优化 → 通知用户
```

**快速响应机制**:
- 严重问题（生成失败）: 24 小时内修复
- 质量问题（效果不佳）: 1 周内优化
- 功能建议: 2 周内评估，1 个月内实施

---

## 📊 成功指标（KPI）

### Phase 1（第 1 周）
- [ ] 5 个功能 prompt 优化完成
- [ ] Italian Brainrot 分享率提升 30%
- [ ] Enhance "过度美化"投诉减少 50%
- [ ] 整体用户满意度 > 4.2/5

### Phase 2（第 2-3 周）
- [ ] Claymation 功能上线
- [ ] 动作手办盒功能上线
- [ ] 新功能进入 Top 5 热门
- [ ] 用户留存率提升 15%

### Phase 3（第 4 周）
- [ ] 多变体生成功能上线
- [ ] 角色库功能上线
- [ ] 付费转化率提升 10%
- [ ] 月活用户增长 20%

### Phase 4（持续）
- [ ] 数据分析系统完善
- [ ] A/B 测试框架运行
- [ ] 每周发布优化更新
- [ ] 用户反馈响应时间 < 48 小时

---

## 🚨 风险与应对

### 风险 1: Gemini API 限流
**影响**: 高峰期生成失败

**应对方案**:
1. 实施请求队列系统
2. 添加重试机制（指数退避）
3. 提供"优先生成"付费选项
4. 错峰引导（提示非高峰时段）

### 风险 2: 生成质量不稳定
**影响**: 用户满意度下降

**应对方案**:
1. 多次生成取最佳结果
2. 质量检测机制（自动重试低质量）
3. 用户可"重新生成"（不计入额度）
4. 持续 prompt 优化

### 风险 3: 竞品快速跟进
**影响**: 差异化优势减弱

**应对方案**:
1. 快速迭代（每周更新）
2. 建立用户社区（提高切换成本）
3. 深耕中文市场（本地化优势）
4. 探索独特功能（角色库、Web 联网）

### 风险 4: 成本超预算
**影响**: 盈利能力下降

**应对方案**:
1. 使用 Batch API（成本减半）
2. 智能缓存（相似请求复用）
3. 分级定价（免费/付费差异化）
4. 成本监控告警系统

---

## 📝 检查清单

### 开发前
- [ ] 需求文档评审
- [ ] 技术方案确认
- [ ] 资源评估（API 额度、服务器）
- [ ] 时间表确认

### 开发中
- [ ] 代码审查
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能测试

### 上线前
- [ ] 内部测试（10 人）
- [ ] 小范围灰度（100 人）
- [ ] 监控系统就绪
- [ ] 回滚方案准备

### 上线后
- [ ] 实时监控（错误率、响应时间）
- [ ] 用户反馈收集
- [ ] 数据分析
- [ ] 快速迭代优化

---

## 🎯 总结

### 核心策略
1. **速度优先** - 利用 Nano Banana 2 的 4-8 秒优势
2. **真实感趋势** - 拥抱"不完美"美学
3. **病毒式功能** - 聚焦 TikTok/Instagram 热门
4. **数据驱动** - 持续优化，快速迭代

### 成功关键
1. **执行速度** - 抢占趋势窗口期
2. **质量控制** - 确保每个功能都好用
3. **用户反馈** - 快速响应，持续改进
4. **差异化** - 建立独特竞争优势

### 下一步行动
1. ✅ **本周**: 完成 Phase 1 优化
2. ✅ **下周**: 启动 Phase 2 新功能开发
3. ✅ **本月**: 完成 Phase 3 差异化功能
4. ✅ **持续**: Phase 4 数据驱动优化

---

**文档版本**: 1.0  
**制定人**: AI 优化团队  
**审批状态**: 待审批  
**下次审查**: 2026-03-18（每周审查进度）
