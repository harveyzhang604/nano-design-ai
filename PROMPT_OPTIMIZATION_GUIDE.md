# Prompt 优化指南 - 基于 2026 年趋势

**更新时间**: 2026-03-11  
**适用模型**: Gemini 3.1 Flash Image (Nano Banana 2)

---

## 📋 目录

1. [通用优化原则](#通用优化原则)
2. [病毒式功能 Prompt](#病毒式功能-prompt)
3. [现有功能优化](#现有功能优化)
4. [参数调优建议](#参数调优建议)
5. [常见问题与解决方案](#常见问题与解决方案)

---

## 🎯 通用优化原则

### 2026 年 Prompt 设计核心原则

#### 1. 真实感优先（Authenticity First）
```
❌ 避免: "perfect skin, flawless, airbrushed, studio perfect"
✅ 使用: "natural skin texture, authentic, subtle imperfections, real moment"
```

#### 2. 风格明确性（Style Specificity）
```
❌ 模糊: "make it artistic"
✅ 明确: "Caravaggio-style chiaroscuro lighting, baroque oil painting texture"
```

#### 3. 技术细节（Technical Details）
```
❌ 简单: "good lighting"
✅ 详细: "soft studio lighting with 3-point setup, rim light on hair, subtle fill light"
```

#### 4. 文化参考（Cultural References）
```
❌ 通用: "anime style"
✅ 具体: "Studio Ghibli watercolor aesthetic, Miyazaki-inspired soft lighting"
```

---

## 🔥 病毒式功能 Prompt

### 1. Italian Brainrot（巴洛克肖像）

**功能定位**: 超现实巴洛克风格肖像，TikTok 爆款

**优化后 Prompt**:
```
Transform this photo into an Italian Brainrot baroque portrait in the style of 17th century Italian masters.

STYLE ELEMENTS:
- Dramatic Caravaggio-style chiaroscuro lighting (strong contrast between light and shadow)
- Rich Renaissance-era clothing: velvet doublet with gold embroidery, lace collar, ornate jewelry
- Exaggerated Italian hand gestures: fingers pinched together, raised dramatically
- Ornate baroque background: classical architecture, marble columns, rich drapery
- Oil painting texture with visible brushstrokes
- Slightly surreal and uncanny aesthetic (not quite realistic, not quite painted)
- Operatic drama and intensity in expression
- Museum-quality portrait from 1600s Italy

TECHNICAL SPECS:
- Maintain facial features and recognizability
- Enhance with period-appropriate styling and lighting
- Rich color palette: deep reds, golds, dark shadows
- High detail in fabric textures and jewelry

OUTPUT: A dramatic baroque portrait that looks like it belongs in an Italian art museum, with a touch of surreal modern twist.
```

**参数建议**:
- Temperature: 0.7
- Top K: 40
- Top P: 0.95
- 分辨率: 1024x1024 或更高

**关键词权重**:
- 高权重: "Caravaggio", "baroque", "chiaroscuro", "Renaissance"
- 中权重: "dramatic", "ornate", "operatic"
- 避免: "modern", "clean", "minimal"

---

### 2. Claymation（黏土动画风格）

**功能定位**: 怀旧定格动画美学，Wallace & Gromit 风格

**推荐 Prompt**:
```
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
```

**参数建议**:
- Temperature: 0.5
- Top K: 32
- Top P: 0.9
- 分辨率: 1024x1024

**关键词权重**:
- 高权重: "claymation", "polymer clay", "stop-motion", "Aardman"
- 中权重: "handcrafted", "matte finish", "chunky"
- 避免: "realistic", "smooth", "glossy"

---

### 3. 动作手办盒（Action Figure Toy Box）

**功能定位**: 怀旧玩具包装美学，收藏品风格

**推荐 Prompt**:
```
Transform this person into a collectible action figure displayed in retail toy packaging.

PACKAGING DESIGN:
- Clear plastic blister pack mounted on colorful cardboard backing
- Product name at top: "[NAME] Action Figure - Limited Edition Series"
- Toy company logo (generic or custom brand)
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
- 2-3 relevant items: sunglasses, phone, coffee cup, laptop, etc.
- Small weapons or tools (optional, based on character)
- Alternate hands or heads (collector's edition)
- Accessories card with item names

PHOTOGRAPHY STYLE:
- Professional toy photography
- Studio lighting with soft shadows
- Slight reflection on plastic blister
- Vibrant, eye-catching colors
- Hasbro/Mattel quality presentation

OUTPUT: A retail-ready action figure package that looks like it belongs on a toy store shelf.
```

**参数建议**:
- Temperature: 0.6
- Top K: 40
- Top P: 0.92
- 分辨率: 1024x1024 或 1024x1536（竖版）

**文字渲染要求**:
- 产品名称必须清晰可读
- 支持自定义名称输入
- 条形码和标签细节

**关键词权重**:
- 高权重: "action figure", "toy packaging", "blister pack", "collectible"
- 中权重: "retail", "accessories", "limited edition"
- 避免: "realistic human", "photograph"

---

### 4. 3D Pixar 风格（Pixar Animation Style）

**功能定位**: 迪士尼/皮克斯动画角色风格

**优化 Prompt**:
```
Transform this photo into a 3D Pixar/Disney animated character in the style of modern Pixar Animation Studios films.

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

PERSONALITY:
- Maintain recognizable features and personality
- Add Pixar's signature warmth and charm
- Expressive, inviting demeanor
- Relatable and endearing

OUTPUT: A character that looks like they belong in a modern Pixar animated feature film.
```

**参数建议**:
- Temperature: 0.6
- Top K: 35
- Top P: 0.9
- 分辨率: 1024x1024

**关键词权重**:
- 高权重: "Pixar", "3D animated", "volumetric", "Disney"
- 中权重: "appealing", "expressive", "warm"
- 避免: "realistic", "photographic", "2D"

---

### 5. Studio Ghibli 水彩风格

**功能定位**: 宫崎骏动画美学，梦幻水彩

**优化 Prompt**:
```
Transform this photo into a Studio Ghibli-style watercolor portrait in the aesthetic of Hayao Miyazaki films.

VISUAL STYLE:
- Soft watercolor painting technique with visible brush textures
- Dreamy, ethereal atmosphere with gentle lighting
- Warm, nostalgic color palette (soft pastels and earth tones)
- Hand-painted feel with organic edges
- Delicate line work for facial features
- Flowing, expressive hair with wind-swept quality

GHIBLI CHARACTERISTICS:
- Innocent, pure expression
- Large, soulful eyes with gentle highlights
- Soft, rounded facial features
- Natural, effortless beauty
- Connection to nature (flowers, leaves, wind elements)
- Magical, whimsical atmosphere

TECHNICAL DETAILS:
- Watercolor paper texture
- Soft color bleeding and gradients
- Minimal harsh lines
- Atmospheric depth with soft backgrounds
- Warm, diffused lighting (golden hour or soft indoor light)

FILM REFERENCES:
- Spirited Away character design
- My Neighbor Totoro warmth
- Howl's Moving Castle romance
- Kiki's Delivery Service charm

OUTPUT: A gentle, magical portrait that captures the warmth and wonder of Studio Ghibli animation.
```

**参数建议**:
- Temperature: 0.7
- Top K: 40
- Top P: 0.95
- 分辨率: 1024x1024

---

## 🔧 现有功能优化

### 1. Enhance（增强）- 添加"自然风格"

**问题**: 当前可能过度美化，失去真实感

**新增"自然增强"Prompt**:
```
Enhance this photo with natural, authentic improvements while preserving its real, human quality.

ENHANCEMENT GOALS:
- Subtle color correction (balanced, not oversaturated)
- Gentle lighting adjustment (natural, not dramatic)
- Preserve skin texture and natural imperfections (pores, freckles, fine lines)
- Maintain film grain if present
- Keep authentic moment feel
- Professional quality without looking "edited"

AVOID:
- Over-smoothing or airbrushing skin
- Removing natural features (moles, freckles, wrinkles)
- Artificial perfection
- Overly vibrant or unrealistic colors
- Heavy filters or effects

STYLE REFERENCE:
- iPhone portrait mode aesthetic
- Natural light photography
- Editorial photography (not fashion retouching)
- Authentic, relatable, real

TECHNICAL APPROACH:
- Minimal intervention
- Enhance what's there, don't replace
- Subtle improvements only
- Maintain original character and mood

OUTPUT: A professionally enhanced photo that still looks real, authentic, and human.
```

**参数建议**:
- Temperature: 0.3（保守增强）
- Top K: 20
- Top P: 0.85

---

### 2. Portrait（肖像）- 真实感优化

**优化 Prompt**:
```
Create a professional portrait with natural, authentic quality.

PORTRAIT STYLE:
- Natural skin texture with visible pores and fine details
- Soft, flattering lighting (not harsh or dramatic)
- Genuine expression and personality
- Professional but approachable feel
- Real human quality, not overly polished

LIGHTING:
- Soft window light or studio softbox
- Gentle shadows that define features
- Natural catchlights in eyes
- Even skin tone without over-correction

TECHNICAL SPECS:
- Shallow depth of field (blurred background)
- Sharp focus on eyes
- Natural color grading
- Professional photography quality
- 85mm portrait lens aesthetic

AVOID:
- Plastic or artificial skin
- Over-smoothing
- Unrealistic perfection
- Heavy makeup look (unless requested)
- Overly dramatic lighting

OUTPUT: A professional portrait that looks like it was taken by a skilled photographer, not generated by AI.
```

---

### 3. Product Photo（产品摄影）- 超写实优化

**优化 Prompt**:
```
Create a professional product photography shot with photorealistic quality.

PHOTOGRAPHY SETUP:
- Clean white or gradient background
- Professional studio lighting (3-point setup)
- Sharp focus with slight depth of field
- Accurate colors and materials
- Commercial photography quality

MATERIAL RENDERING:
- Realistic textures (fabric, metal, plastic, glass)
- Accurate reflections and refractions
- Proper subsurface scattering for translucent materials
- Correct specularity and roughness
- True-to-life colors

LIGHTING DETAILS:
- Key light from 45-degree angle
- Fill light to soften shadows
- Rim light for edge definition
- Soft shadows on background
- No harsh hotspots or blown highlights

COMPOSITION:
- Product centered or following rule of thirds
- Multiple angles available (front, side, detail)
- Clean, uncluttered presentation
- Professional e-commerce quality

OUTPUT: A product photo indistinguishable from professional studio photography, suitable for e-commerce or advertising.
```

**参数建议**:
- Temperature: 0.4（精确控制）
- Top K: 30
- Top P: 0.88

---

## ⚙️ 参数调优建议

### Temperature（温度）设置指南

| 功能类型 | Temperature | 说明 |
|---------|-------------|------|
| **精确控制**（产品照、文档） | 0.3-0.4 | 最小随机性，最大一致性 |
| **自然增强**（enhance, portrait） | 0.4-0.5 | 保守改进，保持原貌 |
| **风格转换**（cartoon, ghibli） | 0.5-0.7 | 平衡创意和控制 |
| **创意生成**（Italian Brainrot, 超现实） | 0.7-0.9 | 更多创意自由 |
| **实验性**（艺术风格） | 0.9-1.0 | 最大创意，结果不可预测 |

### Top K 和 Top P 组合

| 场景 | Top K | Top P | 效果 |
|------|-------|-------|------|
| **保守生成** | 20-25 | 0.85-0.88 | 最可预测，最一致 |
| **标准生成** | 30-35 | 0.9-0.92 | 平衡质量和多样性 |
| **创意生成** | 40-50 | 0.95-0.98 | 更多变化和惊喜 |

### 分辨率建议

| 用途 | 推荐分辨率 | 说明 |
|------|-----------|------|
| **社交媒体** | 1024x1024 | Instagram/TikTok 标准 |
| **竖版内容** | 1024x1536 | Stories/Reels 格式 |
| **横版内容** | 1536x1024 | YouTube 缩略图 |
| **高质量输出** | 2048x2048 | 付费用户，打印质量 |
| **4K 输出** | 4096x4096 | 专业用途（需 Pro） |

---

## 🐛 常见问题与解决方案

### 问题 1: 文字模糊或错误

**症状**: 生成的文字不清晰或拼写错误

**解决方案**:
```
1. 在 prompt 中明确指定文字内容
   ✅ "Text on mug reads exactly: 'MORNING RITUAL'"
   
2. 使用引号强调文字
   ✅ "Product label with text 'ORGANIC COFFEE' in bold sans-serif font"
   
3. 提高分辨率（1024 → 2048）
   
4. 降低 temperature（0.6 → 0.4）
```

### 问题 2: 过度美化/失去真实感

**症状**: 皮肤过于光滑，看起来像塑料

**解决方案**:
```
1. 添加"自然"关键词
   ✅ "natural skin texture, visible pores, authentic"
   
2. 明确避免过度处理
   ✅ "AVOID: airbrushing, over-smoothing, plastic skin"
   
3. 降低 temperature（0.7 → 0.4）
   
4. 参考真实摄影风格
   ✅ "iPhone portrait mode aesthetic, natural light photography"
```

### 问题 3: 风格不够明确

**症状**: 生成结果通用，缺乏特色

**解决方案**:
```
1. 添加具体艺术家/作品参考
   ❌ "artistic style"
   ✅ "Caravaggio-style chiaroscuro lighting"
   
2. 详细描述技术细节
   ❌ "good lighting"
   ✅ "3-point studio lighting with soft key light, subtle fill, rim light on edges"
   
3. 提供多个风格参考
   ✅ "Style: Wallace & Gromit + Coraline + Aardman Animations"
```

### 问题 4: 角色一致性差

**症状**: 同一角色在不同生成中变化太大

**解决方案**:
```
1. 使用详细的角色描述
   ✅ "Same character: Asian woman, 30s, shoulder-length black hair, round glasses, warm smile"
   
2. 保持 prompt 结构一致
   
3. 降低 temperature（0.7 → 0.5）
   
4. 使用参考图片（如果支持）
```

### 问题 5: 生成速度慢

**症状**: 生成时间超过 10 秒

**解决方案**:
```
1. 使用 Gemini 3.1 Flash Image（不是 Pro）
   
2. 降低分辨率（2048 → 1024）
   
3. 简化 prompt（保留核心关键词）
   
4. 避免高峰时段（美国/欧洲工作时间）
```

---

## 📊 A/B 测试建议

### 测试维度

1. **Temperature 对比**
   - 测试 0.4 vs 0.6 vs 0.8
   - 评估创意性 vs 一致性

2. **Prompt 长度**
   - 简短（50 词）vs 详细（200 词）
   - 评估质量 vs 速度

3. **关键词顺序**
   - 风格在前 vs 技术细节在前
   - 评估风格准确性

4. **分辨率影响**
   - 1024 vs 2048
   - 评估质量提升 vs 成本增加

---

## 🎯 最佳实践总结

### ✅ DO（推荐做法）

1. **明确风格参考** - 使用具体艺术家、电影、品牌名称
2. **详细技术描述** - 光线、材质、构图细节
3. **避免词明确** - 列出不想要的元素
4. **保持一致性** - 同类功能使用相似 prompt 结构
5. **测试迭代** - A/B 测试找到最佳参数

### ❌ DON'T（避免做法）

1. **模糊描述** - "make it nice", "good quality"
2. **过度复杂** - 一个 prompt 包含太多矛盾要求
3. **忽略参数** - 只改 prompt 不调参数
4. **照搬竞品** - 理解原理后创新
5. **忽视用户反馈** - 持续收集真实使用数据

---

**文档版本**: 1.0  
**最后更新**: 2026-03-11  
**下次审查**: 2026-04-11
