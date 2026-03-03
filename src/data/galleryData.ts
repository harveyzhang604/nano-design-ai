export interface GalleryItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

export const galleryItems: GalleryItem[] = [
  // ========== 产品摄影 (Product Photography) ==========
  {
    id: 'prod-1',
    title: '金色项链海滩拍摄',
    prompt: 'Show this gold necklace on a sandy beach with gentle morning light and soft shadows, seashells scattered nearby. Product photography, natural lighting, 4K resolution.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    tags: ['珠宝', '海滩', '自然光', '产品摄影']
  },
  {
    id: 'prod-2',
    title: '香水瓶奢华广告',
    prompt: 'Transform this perfume bottle into a luxury cosmetics-style ad with glossy highlights and a reflective black background. Studio lighting, premium aesthetic, 8K detail.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    tags: ['香水', '奢华', '黑色背景', '高光']
  },
  {
    id: 'prod-3',
    title: '护肤品大理石台面',
    prompt: 'Place this skincare cream jar on a marble countertop with natural window light and soft depth of field. Minimal composition, clean aesthetic, photorealistic.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    tags: ['护肤品', '大理石', '窗光', '极简']
  },
  {
    id: 'prod-4',
    title: '智能手表未来场景',
    prompt: 'Place this smartwatch inside a futuristic CGI environment with neon accents, chrome reflections, and glowing floor lights. Cyberpunk aesthetic, 4K render.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    tags: ['智能手表', '未来主义', '霓虹', 'CGI']
  },
  {
    id: 'prod-5',
    title: '咖啡杯沙滩场景',
    prompt: 'Show this coffee mug on a sandy beach with a small palm leaf shadow and soft golden-hour lighting. Lifestyle photography, warm tones, shallow depth of field.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    tags: ['咖啡', '沙滩', '黄金时刻', '生活方式']
  },
  {
    id: 'prod-6',
    title: '运动鞋3D展台',
    prompt: 'Place this running shoe on a premium 3D podium with soft studio lighting and a subtle shadow beneath it. Clean background, product showcase, high detail.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    tags: ['运动鞋', '3D展台', '工作室', '产品展示']
  },
  {
    id: 'prod-7',
    title: '沐浴露水下拍摄',
    prompt: 'Show this shower gel bottle submerged in clear turquoise ocean water, with caustic light reflections shimmering on the surface. Underwater photography, refreshing aesthetic.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    tags: ['沐浴露', '水下', '光影', '清新']
  },
  {
    id: 'prod-8',
    title: '太阳镜电商白底',
    prompt: 'Create a clean ecommerce-ready white background for this pair of sunglasses, with crisp shadows and high realism. Amazon-style product photo, 300 DPI.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    tags: ['太阳镜', '白底', '电商', '高清']
  },
  {
    id: 'prod-9',
    title: '皮革钱包聚光灯',
    prompt: 'Add a dramatic spotlight behind this leather wallet with a smoky gradient atmosphere for a premium hero-shot look. Dark background, cinematic lighting.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    tags: ['皮革', '聚光灯', '烟雾', '英雄镜头']
  },
  {
    id: 'prod-10',
    title: '口红悬浮拍摄',
    prompt: 'Turn this lipstick into a floating hero-shot with suspended particles and a minimal monochrome backdrop. Studio photography, high-end cosmetics aesthetic.',
    category: 'product',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
    tags: ['口红', '悬浮', '粒子', '单色背景']
  },

  // ========== 人像摄影 (Portrait Photography) ==========
  {
    id: 'portrait-1',
    title: '工作室头像拍摄',
    prompt: 'Ultra realistic studio portrait of a young woman with curly dark hair, neutral expression, standing in front of a soft grey backdrop, beauty lighting with softboxes, crisp skin detail, subtle makeup, 85mm lens, shallow depth of field, 4K resolution.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    tags: ['工作室', '头像', '美妆', '柔光箱']
  },
  {
    id: 'portrait-2',
    title: '电影感特写',
    prompt: 'Close-up portrait of an elderly fisherman standing by the sea during a windy afternoon, water droplets on his jacket, dramatic shadows across his face, strong side light inspired by Rembrandt, Arri Alexa cinematic look, 50mm lens, textured skin, 4K.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    tags: ['电影感', '特写', '伦勃朗光', '纹理']
  },
  {
    id: 'portrait-3',
    title: '角色一致性种子',
    prompt: 'Portrait of a 35-year-old man with short black hair, trimmed beard, small scar above his right eyebrow, angular jawline, wearing a navy hoodie, soft window light from the left, realistic photography style, 50mm lens, same character as previous image.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    tags: ['角色一致性', '窗光', '写实', '特征描述']
  },
  {
    id: 'portrait-4',
    title: '时尚编辑大片',
    prompt: 'High fashion editorial photograph of a model wearing a holographic metallic dress with geometric patterns. Studio lighting with colored gels creating purple and blue tones. Vogue magazine style, shot on medium format camera, shallow depth of field.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    tags: ['时尚', '编辑', '全息', '中画幅']
  },
  {
    id: 'portrait-5',
    title: '街头风格肖像',
    prompt: 'Urban street portrait of a young skateboarder in casual streetwear, graffiti wall background, natural afternoon light, candid expression, 35mm lens, documentary photography style, authentic and raw.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    tags: ['街头', '滑板', '涂鸦', '纪实']
  },
  {
    id: 'portrait-6',
    title: '黑白肖像经典',
    prompt: 'Classic black and white portrait, dramatic side lighting, strong contrast, timeless aesthetic, medium format film look, sharp focus on eyes, soft background blur, professional studio setup.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    tags: ['黑白', '侧光', '经典', '胶片感']
  },
  {
    id: 'portrait-7',
    title: '自然光户外肖像',
    prompt: 'Outdoor portrait during golden hour, soft natural backlight creating a halo effect, warm color palette, subject in casual summer dress, field of wildflowers background, dreamy and romantic mood, 85mm f/1.4.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80',
    tags: ['自然光', '黄金时刻', '逆光', '浪漫']
  },
  {
    id: 'portrait-8',
    title: '商业头像拍摄',
    prompt: 'Professional business headshot, clean white background, even lighting, confident expression, formal attire, sharp focus, corporate photography style, suitable for LinkedIn profile, high resolution.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    tags: ['商业', '白底', '正装', '专业']
  },
  {
    id: 'portrait-9',
    title: '创意双重曝光',
    prompt: 'Creative double exposure portrait combining a person\'s profile with a cityscape at night, seamless blend, artistic and conceptual, moody color grading, modern photography technique.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    tags: ['双重曝光', '创意', '城市', '概念']
  },
  {
    id: 'portrait-10',
    title: '环境肖像',
    prompt: 'Environmental portrait of a chef in their kitchen, surrounded by cooking tools and ingredients, natural window light, storytelling composition, documentary style, authentic moment captured.',
    category: 'portrait',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
    tags: ['环境肖像', '厨师', '纪实', '故事性']
  },

  // ========== 室内设计 (Interior Design) ==========
  {
    id: 'interior-1',
    title: '现代极简客厅',
    prompt: 'Wide shot of a modern living room with a large beige sofa, wooden coffee table, floor-to-ceiling windows showing a city skyline at sunset, warm ambient lighting, soft indirect lamps, clean Scandinavian style, 4K render, straight vertical lines.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80',
    tags: ['现代', '极简', '斯堪的纳维亚', '落地窗']
  },
  {
    id: 'interior-2',
    title: '温馨卧室氛围',
    prompt: 'Minimal bedroom with a low platform bed, white linen sheets, textured beige wall, small reading lamp on the side, early morning natural light entering from the left window, soft shadows, calm and cozy atmosphere, lifestyle photography look.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    tags: ['卧室', '温馨', '晨光', '极简']
  },
  {
    id: 'interior-3',
    title: '日式拉面店',
    prompt: 'Interior view of a small Japanese ramen restaurant, wooden counter, hanging lanterns, steam rising from bowls, customers sitting on stools, cinematic warm light, shallow depth of field focused on the ramen bowl in the foreground, realistic textures, 4K.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    tags: ['日式', '拉面店', '暖光', '电影感']
  },
  {
    id: 'interior-4',
    title: '工业风阁楼',
    prompt: 'Industrial loft apartment with exposed brick walls, metal beams, concrete floors, vintage leather furniture, Edison bulb lighting, large factory windows, urban aesthetic, raw and authentic materials.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    tags: ['工业风', '阁楼', '砖墙', '复古']
  },
  {
    id: 'interior-5',
    title: '奢华酒店套房',
    prompt: 'Luxury hotel suite with king-size bed, velvet headboard, crystal chandelier, marble bathroom visible through glass doors, gold accents, plush carpeting, dramatic evening lighting, 5-star hospitality aesthetic.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    tags: ['奢华', '酒店', '水晶吊灯', '大理石']
  },
  {
    id: 'interior-6',
    title: '独立书店内景',
    prompt: 'A warm and inviting independent bookstore interior with floor-to-ceiling wooden bookshelves, vintage leather armchairs, warm Edison bulb lighting, a small coffee bar in the corner. Cozy atmosphere, golden hour light filtering through large windows.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
    tags: ['书店', '温馨', '复古', '咖啡吧']
  },
  {
    id: 'interior-7',
    title: '现代厨房设计',
    prompt: 'Contemporary kitchen with white marble countertops, stainless steel appliances, minimalist cabinetry, pendant lights over island, large windows with garden view, clean lines, functional and elegant design.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
    tags: ['厨房', '现代', '大理石', '岛台']
  },
  {
    id: 'interior-8',
    title: '家庭办公室',
    prompt: 'Modern home office with ergonomic desk setup, large monitor, comfortable chair, floating shelves with plants and books, natural light from side window, productive and inspiring workspace, Scandinavian minimalism.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    tags: ['办公室', '居家', '人体工学', '植物']
  },
  {
    id: 'interior-9',
    title: '波西米亚客厅',
    prompt: 'Bohemian living room with colorful textiles, macrame wall hangings, low seating with floor cushions, indoor plants, warm string lights, eclectic decor, cozy and artistic atmosphere, natural materials.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    tags: ['波西米亚', '编织', '地毯', '植物']
  },
  {
    id: 'interior-10',
    title: '赛博朋克咖啡店',
    prompt: 'A translucent glass robot barista pouring latte art inside a cozy, cyberpunk coffee shop. Macro close-up shot, shallow depth of field (f/1.8), illuminated by neon pink and teal signage reflection. Cinematic 8k render, Octane render style.',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    tags: ['赛博朋克', '咖啡店', '霓虹', '机器人']
  }
];
