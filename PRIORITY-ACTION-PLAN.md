# 优先级行动计划
**项目**: nano-design-ai (TalkPhoto.app)  
**生成时间**: 2026-03-17  
**执行周期**: 2026-03-17 至 2026-04-30

---

## 🔴 P0 - 立即执行 (本周内完成)

### 1. 修复 `restore` 老照片修复功能 ⚠️
**问题**: 用户反馈"表情被改变"  
**影响**: 核心功能体验差，用户流失风险高  
**预计工时**: 2 小时

**执行步骤**:
```bash
# 1. 定位文件
cd /root/.openclaw/workspace/nano-design-ai/src/app/api/restore

# 2. 备份当前 Prompt
cp route.ts route.ts.backup

# 3. 修改 Prompt (见下方代码)

# 4. 测试 (3 张不同表情的老照片)
# - 微笑照片
# - 严肃照片
# - 夸张表情照片

# 5. 对比修复前后表情是否一致

# 6. 部署到生产环境
git add . && git commit -m "fix: 老照片修复防止改变表情" && git push

# 7. 等待 Cloudflare 部署 (10-15 分钟)

# 8. 测试生产环境
curl -s https://talkphoto.app/api/restore -X POST -d '{"imageUrl":"..."}'

# 9. 前端测试 - 实际上传照片测试
```

**优化后的 Prompt**:
```typescript
const restorePrompt = `CRITICAL: Restore this damaged photo while preserving EXACT facial expressions and features.

REPAIR ONLY (Physical Damage):
- Fix scratches, tears, stains, and fading
- Restore missing areas with context-aware filling
- Reduce noise and grain
- Correct color fading and discoloration
- Repair physical damage to the photo surface

PRESERVE IDENTITY (ABSOLUTE PRIORITY):
- Keep facial expressions EXACTLY as they are
- Maintain original smile, frown, or neutral expression
- Do NOT change eyes, mouth, or eyebrow position
- Do NOT beautify or enhance faces
- Do NOT change any facial features
- Keep the original character and emotion
- Preserve natural wrinkles and age characteristics

TECHNICAL RESTORATION:
- Maintain original photo composition
- Preserve original lighting and shadows
- Keep original color palette (if color photo)
- Restore natural skin texture (not smooth)

GOAL: Make it look like the photo was never damaged, but keep EVERYTHING else identical - especially facial expressions and emotions.`;
```

**验收标准**:
- ✅ 修复后表情与原图一致
- ✅ 划痕/破损被修复
- ✅ 画质提升但不过度美化
- ✅ 3 张测试照片全部通过

---

### 2. 为所有 API 端点添加重试机制 🔄
**问题**: 只有 `filter` 有重试，其他功能失败率高  
**影响**: 用户体验差，成功率低  
**预计工时**: 4 小时

**执行步骤**:
```bash
# 1. 创建通用重试函数
# 文件: src/lib/gemini-retry.ts

# 2. 逐个修改 API 端点 (优先级排序)
# P0 功能优先:
# - restore, colorize, upscale, remove-bg
# - enhance, portrait, erase, change-bg

# 3. 每修改一个功能就测试一次

# 4. 全部完成后批量提交
```

**通用重试函数**:
```typescript
// src/lib/gemini-retry.ts
export async function generateWithRetry(
  prompt: string,
  imageBase64: string,
  options: {
    maxAttempts?: number;
    baseTemperature?: number;
    model?: string;
  } = {}
) {
  const {
    maxAttempts = 3,
    baseTemperature = 0.4,
    model = 'gemini-3.1-flash-image-preview'
  } = options;

  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/png', data: imageBase64.split(',')[1] } }
              ]
            }],
            generationConfig: {
              temperature: baseTemperature + (attempt - 1) * 0.05,
              topK: 40,
              topP: 0.95
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        lastError = data.error?.message || 'Gemini API Error';
        console.error(`Attempt ${attempt}/${maxAttempts} failed:`, lastError);

        // 地区限制错误不重试
        if (lastError.includes('location') || lastError.includes('region')) {
          throw new Error('This feature is not available in your region');
        }

        if (attempt < maxAttempts) {
          await sleep(1000 * attempt); // 指数退避
          continue;
        }
        throw new Error(lastError);
      }

      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData);
      const base64Data = imagePart?.inlineData?.data;

      if (!base64Data) {
        lastError = 'No image data returned';
        console.error(`Attempt ${attempt}/${maxAttempts}: No image data`);
        if (attempt < maxAttempts) {
          await sleep(1000 * attempt);
          continue;
        }
        throw new Error('No image data returned from AI');
      }

      return `data:image/png;base64,${base64Data}`;

    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxAttempts} error:`, error);
      if (attempt < maxAttempts && !error.message.includes('region')) {
        await sleep(1000 * attempt);
      } else {
        throw error;
      }
    }
  }

  throw new Error(`Failed after ${maxAttempts} attempts: ${lastError}`);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**使用示例**:
```typescript
// 修改前
const apiResponse = await fetch(...);
const data = await apiResponse.json();
const base64Data = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

// 修改后
import { generateWithRetry } from '@/lib/gemini-retry';

const base64Data = await generateWithRetry(prompt, imageBase64, {
  maxAttempts: 3,
  baseTemperature: 0.4
});
```

---

### 3. 优化 `action-figure` 包装盒效果 📦
**问题**: 包装盒不够真实，缺少细节  
**影响**: 热门功能体验不佳  
**预计工时**: 2 小时

**优化 Prompt**:
```typescript
const actionFigurePrompt = `Transform this person into a collectible action figure displayed in retail packaging.

3D FIGURE DESIGN:
- Stylized 3D character based on the person
- Designer toy aesthetic (Hot Toys / Funko style)
- Articulated joints visible (shoulders, elbows, hips, knees)
- Detailed sculpting and paint application
- Realistic toy materials (plastic, fabric, metal accents)

RETAIL PACKAGING (CRITICAL):
- Clear plastic window showing the figure
- Cardboard backing with brand logo and graphics
- Product name: "[Person's Name] Action Figure"
- Series information and edition number
- Barcode at bottom (realistic retail barcode)
- Price tag: $29.99 (optional)
- "Ages 14+" warning label
- Small text: "Choking hazard - small parts"

ACCESSORIES:
- Include 2-3 accessories related to person's interests
- Display accessories in packaging compartments
- Examples: laptop, camera, coffee cup, phone, etc.

LIGHTING & PRESENTATION:
- Studio product photography lighting
- Reflections on plastic window
- Professional retail display quality
- Slight depth of field (figure in focus)
- Clean white or gradient background

GOAL: Make it look like a real collectible toy you'd find in a specialty store - detailed, professional, and highly desirable.`;
```

---

## 🟡 P1 - 重要功能 (2 周内完成)

### 4. 新增功能: "Time Travel Hug" (时光拥抱) 💝
**市场需求**: 2026 年最火的情感类 AI 功能  
**病毒传播潜力**: ⭐⭐⭐⭐⭐  
**预计工时**: 8 小时

**技术方案**:
```bash
# 1. 创建 API 端点
mkdir -p src/app/api/time-travel-hug
touch src/app/api/time-travel-hug/route.ts

# 2. 实现核心逻辑 (见下方代码)

# 3. 前端集成
# - 添加到 tools 列表
# - 创建上传界面 (童年照 + 当前照)
# - 添加互动类型选择 (拥抱/牵手/对话)

# 4. 测试
# - 3 组不同年龄差的照片
# - 不同互动类型
# - 边缘场景 (照片质量差、角度不同)

# 5. 部署
```

**API 实现**:
```typescript
// src/app/api/time-travel-hug/route.ts
import { NextResponse } from 'next/server';
import { generateWithRetry } from '@/lib/gemini-retry';
import { uploadToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

const interactionPrompts = {
  hug: `Create an emotional scene where an adult version and child version of the same person embrace.

SCENE COMPOSITION:
- Adult (current age) gently hugging their younger self (childhood)
- Warm, nostalgic atmosphere with soft golden lighting
- Simple background (park bench, home interior, or abstract warm gradient)
- Natural, comfortable positioning

EMOTIONAL STORYTELLING:
- Gentle, protective body language from adult
- Both versions with soft, peaceful expressions
- Sense of comfort, reassurance, and love
- Timeless, dreamlike quality
- Subtle emotional depth in their eyes

CHARACTER CONSISTENCY:
- SAME person at two different ages
- Maintain facial features across both ages
- Natural age progression (child → adult)
- Consistent hair color and eye color

TECHNICAL REQUIREMENTS:
- Photographic quality, not illustration
- Natural interaction and body positioning
- Realistic shadows and lighting
- Soft focus on background, sharp on subjects
- Cinematic color grading (warm tones)

GOAL: Capture the profound emotion of meeting your past self - comforting, nostalgic, healing, and deeply personal. Like a memory you wish you had.`,

  handHold: `Create a touching scene where an adult and their child self walk together, holding hands.

SCENE COMPOSITION:
- Side view or slight angle, walking together
- Adult holding child's hand gently
- Path or simple background (park, beach, sunset)
- Sense of journey and companionship

EMOTIONAL STORYTELLING:
- Protective yet equal relationship
- Both looking forward (toward future)
- Peaceful, hopeful atmosphere
- Sense of guidance and support

[Same CHARACTER CONSISTENCY and TECHNICAL REQUIREMENTS as above]

GOAL: Capture the feeling of guiding your younger self through life - protective, hopeful, and deeply meaningful.`,

  conversation: `Create an intimate scene where an adult and their child self sit face to face, having a conversation.

SCENE COMPOSITION:
- Sitting across from each other (bench, floor, chairs)
- Eye contact or gentle interaction
- Warm indoor lighting or soft outdoor setting
- Intimate, private atmosphere

EMOTIONAL STORYTELLING:
- Deep connection and understanding
- Adult listening to child, or vice versa
- Sense of wisdom being shared
- Peaceful, reflective mood

[Same CHARACTER CONSISTENCY and TECHNICAL REQUIREMENTS as above]

GOAL: Capture the profound moment of connecting with your past self - understanding, forgiveness, and self-love.`
};

export async function POST(req: Request) {
  try {
    const { childhoodImage, currentImage, interactionType = 'hug' } = await req.json();

    if (!childhoodImage || !currentImage) {
      return NextResponse.json(
        { error: 'Both childhood and current images are required' },
        { status: 400 }
      );
    }

    const prompt = interactionPrompts[interactionType as keyof typeof interactionPrompts] || interactionPrompts.hug;

    // 组合两张照片的信息到 prompt
    const fullPrompt = `${prompt}

REFERENCE IMAGES:
- Image 1: Childhood photo (younger self)
- Image 2: Current photo (adult self)

Use these images to maintain facial consistency across both ages.`;

    // 注意: Gemini 可能需要特殊处理多图输入
    // 这里简化处理，实际可能需要调整
    const result = await generateWithRetry(fullPrompt, currentImage, {
      maxAttempts: 3,
      baseTemperature: 0.5 // 稍高温度以增加创意
    });

    const r2Url = await uploadToR2(result, 'time-travel-hug');

    return NextResponse.json({
      imageUrl: r2Url || result,
      isR2: !!r2Url,
      interactionType
    });

  } catch (error: any) {
    console.error('Time Travel Hug error:', error);
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
```

**前端集成**:
```typescript
// 添加到 tools 列表
{
  id: 'time-travel-hug',
  name: '时光拥抱',
  icon: Heart,
  color: 'from-rose-500 to-pink-500',
  desc: '拥抱童年的自己',
  category: 'P0',
  hot: true, // 标记为热门
  viral: true // 标记为病毒式传播潜力
}
```

---

### 5. 新增功能: "Brainrot Generator" (脑洞生成器) 🤪
**市场需求**: TikTok/Instagram 最火的荒诞幽默内容  
**病毒传播潜力**: ⭐⭐⭐⭐⭐  
**预计工时**: 6 小时

**实现方案**:
```typescript
// src/app/api/brainrot/route.ts
const brainrotPrompts = {
  animalProfession: `Create a photorealistic image of a [animal] working as a [profession] in a [setting].

ABSURD REALISM (Core Concept):
- Hyper-realistic animal rendering (fur/feathers/scales in perfect detail)
- Animal wearing perfectly tailored professional clothing
- Serious, professional demeanor and body language
- Completely straight-faced, no cartoon elements
- Cinematic lighting and composition

HUMOR THROUGH CONTRAST:
- Animal behaving completely human
- Formal professional setting with absurd subject
- Dramatic lighting for comedic effect
- Meme-worthy composition and framing
- The funnier because it's so realistic

TECHNICAL QUALITY:
- Professional photography quality
- Sharp focus on subject
- Appropriate depth of field
- Realistic shadows and reflections
- Studio or location lighting

EXAMPLES:
- Capybara in tuxedo at luxury gala dinner
- Penguin as CEO in corporate boardroom
- Sloth as surgeon in operating room
- Raccoon as lawyer in courtroom
- Otter as barista in coffee shop

GOAL: Make it look SO real it's funny - the absurdity comes from perfect execution. Like a professional photo that shouldn't exist.`,

  animalSport: `Photorealistic [animal] as professional athlete playing [sport].

[Similar structure to above, adapted for sports scenarios]`,

  animalCelebrity: `[Animal] as famous celebrity at red carpet event.

[Similar structure, adapted for celebrity scenarios]`
};

// 前端: 提供预设组合 + 自定义输入
const presets = [
  { animal: 'capybara', profession: 'CEO', setting: 'boardroom' },
  { animal: 'penguin', profession: 'lawyer', setting: 'courtroom' },
  { animal: 'sloth', profession: 'surgeon', setting: 'operating room' },
  // ... 更多预设
];
```

---

### 6. 优化 `character-library` 角色一致性 👤
**问题**: 同一角色在不同场景中外观变化大  
**影响**: 核心差异化功能体验差  
**预计工时**: 6 小时

**技术方案**:
```typescript
// 1. 第一次生成时保存角色特征
interface CharacterProfile {
  id: string;
  name: string;
  baseImage: string; // base64
  features: {
    faceShape: string;
    eyeColor: string;
    hairStyle: string;
    hairColor: string;
    skinTone: string;
    distinctiveFeatures: string[];
  };
  createdAt: number;
}

// 2. 后续生成时引用角色特征
const characterConsistencyPrompt = `Generate [scene] with this EXACT character.

CHARACTER CONSISTENCY (ABSOLUTE PRIORITY):
- This is the SAME character from previous images
- Maintain EXACT facial features: ${character.features.faceShape}
- Keep EXACT eye color: ${character.features.eyeColor}
- Preserve EXACT hair: ${character.features.hairStyle}, ${character.features.hairColor}
- Keep EXACT skin tone: ${character.features.skinTone}
- Maintain distinctive features: ${character.features.distinctiveFeatures.join(', ')}

REFERENCE IMAGE:
[Include base64 of character's base image]

ONLY CHANGE:
- Clothing and outfit
- Pose and body position
- Background and setting
- Lighting and atmosphere

EVERYTHING ELSE STAYS IDENTICAL.

NEW SCENE: ${userSceneDescription}`;
```

---

## 🟢 P2 - 长期优化 (1 个月内完成)

### 7. 添加 "Authenticity Slider" 真实感控制 🎚️
**功能**: 让用户控制 AI 美化程度  
**预计工时**: 4 小时

### 8. 优化 `vintage-film` 胶片效果增强 📷
**功能**: 增加颗粒感、光晕、一次性相机模式  
**预计工时**: 3 小时

### 9. 建立 A/B 测试和数据追踪系统 📊
**功能**: 追踪功能使用率、成功率、用户满意度  
**预计工时**: 8 小时

---

## 📅 时间线

### Week 1 (2026-03-17 ~ 03-23)
- ✅ 修复 `restore` 功能
- ✅ 添加重试机制 (P0 功能)
- ✅ 优化 `action-figure` 包装盒

### Week 2 (2026-03-24 ~ 03-30)
- 🆕 开发 "Time Travel Hug"
- 🆕 开发 "Brainrot Generator"
- ✅ 添加重试机制 (P1 功能)

### Week 3-4 (2026-03-31 ~ 04-13)
- ✅ 优化 `character-library` 角色一致性
- ✅ 添加 "Authenticity Slider"
- ✅ 优化 `vintage-film`

### Week 5-6 (2026-04-14 ~ 04-30)
- 📊 建立数据追踪系统
- 📈 根据数据优化 Prompt
- 🧪 A/B 测试框架

---

## ✅ 验收标准

### 功能完成标准
- [ ] 代码实现完成
- [ ] 单元测试通过
- [ ] 3 个真实场景测试通过
- [ ] 部署到生产环境
- [ ] 前端功能正常显示
- [ ] 实际用户测试通过

### 质量标准
- [ ] 成功率 > 90%
- [ ] 处理时间 < 5 秒
- [ ] 用户满意度 > 4.0/5.0
- [ ] 无严重 bug

---

## 📝 每日检查清单

### 开发前
- [ ] 阅读相关文档和用户反馈
- [ ] 确认优化目标和验收标准
- [ ] 准备测试数据

### 开发中
- [ ] 遵循 Prompt 优化检查清单
- [ ] 每完成一个功能就测试
- [ ] 记录遇到的问题和解决方案

### 开发后
- [ ] 完整测试流程
- [ ] 部署到生产环境
- [ ] 等待 10-15 分钟部署完成
- [ ] 测试生产环境功能
- [ ] 更新文档和 changelog

---

**维护者**: 火山  
**审核者**: 张华  
**下次审查**: 每周五
