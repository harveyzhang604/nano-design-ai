# Prompt 优化检查清单
**项目**: nano-design-ai  
**用途**: 每次优化 Prompt 时的标准检查流程

---

## ✅ 优化前检查

### 1. 问题诊断
- [ ] 收集用户反馈 (具体问题是什么？)
- [ ] 查看失败案例 (哪些场景下失败？)
- [ ] 分析当前 Prompt (哪里可能导致问题？)
- [ ] 确定优化目标 (期望达到什么效果？)

### 2. 竞品研究
- [ ] 查看同类功能的市场表现
- [ ] 分析竞品的 Prompt 策略
- [ ] 找出差异化机会

---

## 📝 Prompt 编写标准

### 必须包含的 4 个部分

#### 1. **功能描述** (What to do)
```
Transform this image with [specific effect].
Apply [specific changes].
```

#### 2. **身份保护** (Identity Preservation)
```
PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural proportions
- Keep face shape and character
- Preserve personality
```

#### 3. **自然融合** (Natural Integration)
```
NATURAL INTEGRATION:
- Blend naturally with surroundings
- Realistic shadows and highlights
- Appropriate lighting and texture
- Natural appearance
```

#### 4. **目标导向** (Goal Statement)
```
GOAL: [Describe the desired feeling/outcome]
Example: "Like they just stepped out of a salon - natural, polished, confident."
```

---

## 🎨 情感化语言指南

### ❌ 避免技术性描述
- "Change hairstyle to short"
- "Apply filter effect"
- "Modify facial features"

### ✅ 使用情感化描述
- "Like they just got a great haircut - natural, flattering, confident"
- "Create a warm, inviting atmosphere that feels like home"
- "Capture the emotion of meeting your past self - comforting, nostalgic"

### 情感词汇库
**积极情感**:
- confident, natural, effortless, beautiful, elegant, sophisticated
- warm, inviting, cozy, comfortable, relaxed, peaceful
- bold, powerful, striking, dramatic, impressive

**怀旧情感**:
- nostalgic, vintage, retro, timeless, classic, authentic
- memories, childhood, past, history, heritage

**创意情感**:
- playful, whimsical, creative, artistic, imaginative, unique
- surprising, unexpected, delightful, charming

---

## 🔒 身份保护强化

### 标准模板
```
PRESERVE IDENTITY (CRITICAL):
- Keep facial features EXACTLY the same
- Maintain natural hairline and head shape
- Keep face shape and proportions
- Preserve personality and character
- Do NOT change expressions or emotions
- Do NOT beautify unless explicitly requested
```

### 特殊场景加强

**老照片修复**:
```
CRITICAL: Preserve EXACT facial expressions and features.
- Do NOT change smile, eyes, or mouth position
- Do NOT beautify or enhance faces
- Keep the original character and emotion
```

**发型/妆容变化**:
```
PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Only change: [hair/makeup/specified element]
- Everything else stays identical
```

---

## 🎯 指令精确性

### 使用具体描述
❌ "Make it look good"  
✅ "Apply warm golden tones, increase contrast by 20%, add subtle film grain"

❌ "Change the background"  
✅ "Replace background with a modern minimalist office, white walls, large windows, natural daylight"

### 使用约束条件
```
CONSTRAINTS:
- Resolution: maintain original quality
- Aspect ratio: preserve original proportions
- Color palette: [specific colors]
- Style: [specific aesthetic]
```

---

## 🧪 测试流程

### 1. 基础测试 (3 张图)
- [ ] 正常场景 (标准人像/物体)
- [ ] 边缘场景 (侧脸/遮挡/光线差)
- [ ] 极端场景 (夸张表情/特殊角度)

### 2. 对比测试
- [ ] 旧 Prompt vs 新 Prompt
- [ ] 记录差异和改进点
- [ ] 确认没有退化

### 3. 用户验收
- [ ] 内部测试通过
- [ ] 小范围用户测试 (10-20 人)
- [ ] 收集反馈并迭代

---

## 📊 效果评估标准

### 定量指标
- [ ] 成功率 > 90%
- [ ] 重试率 < 20%
- [ ] 处理时间 < 5 秒

### 定性指标
- [ ] 结果符合预期
- [ ] 身份保持一致
- [ ] 自然真实不做作
- [ ] 用户满意度高

---

## 🔄 迭代优化流程

### 版本管理
```typescript
const promptConfig = {
  version: '2.1',
  lastUpdated: '2026-03-17',
  changelog: '修复表情改变问题，增强身份保护',
  author: '火山',
  testResults: {
    successRate: 0.95,
    avgProcessingTime: 3.2,
    userSatisfaction: 4.5
  }
};
```

### 持续改进
1. **收集数据** → 2. **分析问题** → 3. **优化 Prompt** → 4. **A/B 测试** → 5. **全量发布**

---

## 🚨 常见问题与解决方案

### 问题 1: AI 改变了人物表情
**原因**: Prompt 中有"enhance"、"improve"等词  
**解决**: 明确说明"Keep expressions EXACTLY as they are"

### 问题 2: 结果不够自然
**原因**: 过度技术化的描述  
**解决**: 使用情感化语言，强调"natural"、"effortless"

### 问题 3: 身份不一致
**原因**: 没有强调身份保护  
**解决**: 添加"PRESERVE IDENTITY"部分，使用"EXACTLY"、"CRITICAL"等强调词

### 问题 4: 风格不符合预期
**原因**: 描述不够具体  
**解决**: 添加参考风格、具体参数、视觉示例

---

## 📚 Prompt 模板库

### 1. 人像修改类
```
[功能描述]

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural proportions
- Preserve personality

NATURAL INTEGRATION:
- Blend naturally
- Realistic lighting
- Natural appearance

GOAL: [情感化目标]
```

### 2. 风格转换类
```
Transform this image to [style].

STYLE CHARACTERISTICS:
- [具体风格元素]
- [色彩特征]
- [质感描述]

PRESERVE:
- Original composition
- Subject identity
- Key details

GOAL: [期望效果]
```

### 3. 场景生成类
```
Create [scene description].

SCENE ELEMENTS:
- [主体描述]
- [环境描述]
- [光线氛围]

COMPOSITION:
- [构图要求]
- [视角要求]
- [细节要求]

GOAL: [情感目标]
```

---

## 🎓 学习资源

### 推荐阅读
1. Google Nano Banana 2 官方文档
2. Midjourney Prompt 最佳实践
3. DALL-E 3 Prompt 工程指南

### 内部案例
- `hairstyle` Prompt 优化 (2026-03-07) - 情感化成功案例
- `filter` Prompt 优化 (2026-03-07) - 重试机制案例
- `restore` Prompt 优化 (2026-03-17) - 身份保护案例

---

**维护者**: 火山  
**最后更新**: 2026-03-17  
**下次审查**: 每月 1 号
