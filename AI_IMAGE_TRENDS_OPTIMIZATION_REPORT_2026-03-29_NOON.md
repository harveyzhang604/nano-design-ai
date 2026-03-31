# AI 图像趋势优化报告 2026-03-29（午报）

**生成时间**: 2026-03-29 11:43 CST  
**执行标识**: cron:479b25a1-084f-4cd6-9e8f-fb9d87aff4d1  
**定位**: 本日第二报 — 凌晨报 P0 任务执行跟进 + 新一轮全网竞品扫描 + 具体 Prompt Diff 方案

---

## 一、凌晨报 P0 任务状态核查

凌晨 05:43 报告列出以下 P0 任务。本报告提供**具体可执行的 Prompt 修改方案**，便于直接落地：

| 任务 | 优先级 | 本报告提供 |
|------|--------|----------|
| action-figure Prompt 升级（包装盒细节） | 🔴 P0 | ✅ 完整 diff 方案（见第三节） |
| lego Prompt 完善 | 🔴 P0 | ✅ 完整 diff 方案（见第四节） |
| restore 防过度修复约束 | 🔴 P0 | ✅ 补丁方案（见第五节） |
| Funko Pop 盲盒预设新增 | 🔴 P0 | ✅ 完整新预设代码（见第三节） |

---

## 二、本次全网扫描新发现（2026-03-29 上午）

### 🆕 新信号 #1：ChatGPT「根据你的性格描绘你」趋势（1周内爆发）
- **来源**：TikTok discover / 搜索「AI photo trend March 2026」（1周前）
- **内容**：用户让 ChatGPT「读取我发的内容、我的性格，然后生成我的样貌」→ 大量 UGC 分享「AI 猜对了吗？」
- **关联机会**：nano-banana 的 `portrait` 或新功能可做「AI 画你」 → 用户上传几张生活照，AI 生成一张「最能代表你的肖像」
- **差异化**：ChatGPT 版本需要文字描述，nano-banana 可做「纯图片输入版本」

### 🆕 新信号 #2：TikTok 2026 趋势报告中 AI 滤镜仍是核心但「视频化」压力增大
- **来源**：cyberlink.com（6天前）、socialbee.com（6天前）
- **内容**：TikTok 2026年十大挑战中，AI 图像趋势仍占显著位置，但竞争正在从「图片」向「视频」迁移
- **战略建议**：短期（1个月内）继续强化图像功能；中期考虑将热门功能输出为「对比卡片」格式（before/after Reels 素材），延伸至视频场景

### 🆕 新信号 #3：竞品工具对比（最新截面）
来源：overchat.ai 2026-03-28 发布的竞品横评

| 平台 | 杀手特性 | 免费计划 | 无需注册 |
|------|---------|---------|--------|
| Overchat AI | 多种手办风格 + 无限免费 | ✅ | ✅ |
| EaseMate AI | 极速生成（<30s） | ✅ | ❌ |
| ImagineMe | Lego/Mattel 多品牌风格 | 部分 | ❌ |
| nano-banana | 媒体背书 + 26功能矩阵 | ✅ | ✅ |

**nano-banana 差异化优势**：唯一有媒体（Hindustan Times）点名的工具 + 功能矩阵最广 → 应在落地页强化「as seen in media」背书

### 🆕 新信号 #4：artsmart.ai 2026 AI 图像趋势报告（3月15日）核心结论
- **超写实 AI 摄影**：电商产品图、房产空间渲染已普及 → 对 nano-banana 意味着 `photo-shoot` 和 `interior-design` 功能价值上升
- **AI Studio 灯光模拟**：灯光质量成为区分工具好坏的新标准 → prompt 中强调灯光细节的重要性提升
- **Action Figure + Ghibli + Lego**：明确被列为 2026 年「病毒格式三巨头」

---

## 三、Action Figure：完整 Prompt 升级 Diff

### 当前问题
查看 `src/app/api/action-figure/route.ts`，当前 prompt 存在以下缺失：
- ❌ 无 UPC 条形码描述
- ❌ 无年龄警告贴纸（Age 8+ warning）
- ❌ 无能力/技能面板（abilities stats）
- ❌ 无零售货架背景光
- ❌ 无品牌 Logo / 人物名称面板
- ❌ 无塑料包装光泽描述
- ❌ 无 Funko Pop / 盲盒预设

### 修改方案：在 CRITICAL ACTION FIGURE CHARACTERISTICS 区块追加

在 route.ts 中找到：
```
CRITICAL ACTION FIGURE CHARACTERISTICS:
- Plastic toy material with visible joints and articulation points
...
```

在该区块**末尾追加**以下内容：
```
PACKAGING REALISM DETAILS (MANDATORY):
- Retail blister card or window box with full-color character art backing
- Fictional character name prominently displayed as custom brand logo on packaging
- Abilities/stats panel on packaging back: Speed ██░░░, Strength ████░, Intelligence ███░░ (visual bar chart style)
- Age warning sticker: "Ages 8+" with child icon, choking hazard warning "SMALL PARTS"
- Authentic-looking UPC barcode in bottom right corner of packaging
- Collector series numbering: "Figure 1 of 24" or "Series 3"
- Holographic or foil accent on "COLLECTOR EDITION" badge

LIGHTING & ENVIRONMENT:
- Fluorescent retail store aisle lighting overhead
- Warm ambient glow simulating toy department ceiling lights  
- Background: slightly blurred toy store shelf with other packaged figures visible
- Product photography style: 3/4 angle view showing both figure and full packaging
- Plastic window sheen: subtle Fresnel reflection on clear blister
```

### 新增预设：Funko Pop 盲盒

在 `actionFigureStyles` 对象中追加：

```typescript
'funko-pop': `FUNKO POP! VINYL FIGURE STYLE
- Oversized head with tiny body (chibi proportion, 3.5-inch scale)
- Large round black eyes (no pupils), simplified cute face
- Matte vinyl plastic finish, pastel or vibrant colors
- Minimal facial detail — dots for eyes, simple curve for mouth
- Chunky stylized proportions with rounded edges
- Blind box packaging: sealed cardboard box, die-cut window opening
- "MYSTERY FIGURE" text, "1 of 12" numbering, "CHASE VARIANT" foil sticker
- Bold graphic design on box, kawaii aesthetic
- Photo shot at slight downward angle to emphasize oversized head`,

'vintage-80s': `VINTAGE 1980s ACTION FIGURE STYLE
- He-Man / G.I. Joe / Kenner Star Wars era aesthetic
- Slightly chunky, simplified sculpt typical of 80s manufacturing
- Limited articulation (5-7 points) with classic
---

## 四、Lego Prompt 完整升级方案

目标：让 lego 功能在「可辨识度」和「积木质感」上超越竞品。

在 lego route 的 prompt 中追加以下层：
```
LEGO MINIFIGURE REALISM:
- Classic cylindrical head with printed face (simple dot eyes, smile curve)
- Signature LEGO stud texture on top of head, hands, and flat surfaces
- Iconic "C-clip" hands capable of holding accessories
- Blocky rectangular torso with printed graphic design
- Printed leg design (no physical texture, 2D decoration)
- Official LEGO yellow skin tone OR licensed character skin accuracy
- Accessories: LEGO brick-built weapon/tool where applicable

PACKAGING (if shown):
- LEGO branded poly bag or mini box
- Red LEGO logo prominent, set number (e.g., "LEGO 75000")
- Age range: "6+" sticker, piece count badge
- White background product photography with subtle drop shadow
- Shallow depth of field, 3/4 angle shot
```

---

## 五、Restore（老照片修复）Prompt 防过度修复补丁

在 restore route 的 prompt 中追加硬约束层：
```
CRITICAL PRESERVATION RULES (DO NOT VIOLATE):
- DO NOT change facial expression — preserve exact smile/frown/neutral as in original
- DO NOT alter facial features, eye shape, nose shape, or face structure
- DO NOT add beauty filters or skin smoothing beyond repairing physical damage
- DO NOT change age appearance of subjects
- DO NOT colorize unless explicitly requested (preserve B&W if original is B&W)
- ONLY repair: scratches, tears, fold lines, water stains, fading, dust spots
- Treat as archival restoration — goal is document fidelity, not aesthetic improvement
```

---

## 六、其他功能优化补丁汇总

### ghibli — 加入「真人入画」主诉求
```
[追加到现有 prompt 开头]
Transform the PERSON in this photo into a Studio Ghibli animated character while PRESERVING their facial structure and identity. The output should feel like this specific person exists inside a Ghibli film — not a generic Ghibli character.
```

### cartoon — 新增 Pixar 2025 预设
```
'pixar-2025': Pixar-style 3D render, subsurface skin scattering, large expressive eyes (30% bigger than realistic), smooth matte skin, rim lighting, consistent with Inside Out 2 / Elemental visual standard, cinematic depth of field background.
```

### filter — 新增 3 个高热预设
| 新预设 | 描述 |
|--------|------|
| `fairy-core` | 梦幻蕾丝光晕，柔焦花卉叠加，粉白色调 |
| `dark-academia` | 棕褐色调，羽毛笔纸张质感，复古图书馆氛围 |
| `solarpunk` | 绿植未来，温暖日光，生态乌托邦风格 |

---

## 七、竞品差距总结（本次扫描结论）

| 维度 | nano-banana 现状 | 竞品最强水位 | 差距 |
|------|----------------|------------|------|
| action-figure 包装细节 | 缺 UPC/stats/barcode | MakeMeA.ai 全有 | 可1天内修复 ✅ |
| Funko Pop 预设 | 无 | Overchat AI 有 | 可当天新增 ✅ |
| 免费+无注册 | ✅ 已有 | 竞品多数需注册 | 保持优势 ✅ |
| 媒体背书 | Hindustan Times 点名 | 竞品无同级背书 | 独特优势，需落地页强化 |
| 功能矩阵宽度 | 26个功能 | 竞品通常5-8个 | 明显优势 ✅ |
| 生成速度 | 未优化 | EaseMate <30s | 需持续关注 ⚠️ |

---

## 八、今日剩余时间行动计划

### 🔴 现在立即（今天上午/下午）
1. **action-figure route.ts** → 在 CRITICAL 区块末尾追加包装细节 prompt（第三节代码直接复制）
2. **action-figure route.ts** → 新增 `funko-pop` 和 `vintage-80s` 两个预设
3. **restore route.ts** → 追加防过度修复约束层（第五节代码直接复制）

### 🟡 今天下午
4. **lego route.ts** → 追加积木质感细节（第四节代码）
5. **ghibli route.ts** → 在 prompt 开头插入「真人入画」主诉求
6. **落地页** → action-figure 页面标题改为「AI Action Figure Generator - Turn Any Photo Into a Collectible Toy Box」+ 加「as featured in media」背书

### 🟢 本周
7. cartoon 增加 Pixar 2025 预设
8. filter 增加 fairy-core / dark-academia / solarpunk
9. yearbook 扩展为「时光机」系列（1950s→2005s）
10. 考虑「AI 画你」功能原型（应对 ChatGPT 性格肖像趋势）

---

## 九、结论

本次扫描确认凌晨报告判断正确：**action-figure 仍处于历史峰值窗口，今天是修复 prompt 差距的最后最优时机。**

新增发现：
- ChatGPT「性格画像」趋势（1周内）→ 中期新功能储备
- Overchat AI 已成主要竞争对手（免费+无注册+多风格）→ nano-banana 需要在「生成质量」和「媒体背书」上建立护城河
- 视频化压力增大 → before/after 对比卡片是短期应对策略，不需要开发视频功能

**最终优先级不变**：action-figure prompt 升级 > Funko Pop 新预设 > restore 防过度修复 > 其他。

---
*报告自动生成 by 火山 AI · nano-design-ai cron job · 2026-03-29 11:43 CST*
