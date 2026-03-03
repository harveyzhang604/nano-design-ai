// 主要领域分类
export const mainDomains = [
  {
    id: 'design',
    name: '设计领域',
    icon: 'Palette',
    description: '视觉设计、创意艺术'
  },
  {
    id: 'content',
    name: '内容创作',
    icon: 'FileText',
    description: '文章配图、社交媒体'
  },
  {
    id: 'education',
    name: '教育科普',
    icon: 'BookOpen',
    description: '信息图表、教学素材'
  },
  {
    id: 'lifestyle',
    name: '生活方式',
    icon: 'Coffee',
    description: '美食、旅行、家居'
  },
  {
    id: 'business',
    name: '商业营销',
    icon: 'TrendingUp',
    description: '广告、品牌、电商'
  },
  {
    id: 'entertainment',
    name: '娱乐媒体',
    icon: 'Film',
    description: '影视、游戏、动漫'
  }
];

// 设计分类和提示词模板配置
export const designCategories = [
  {
    id: 'fashion',
    name: '服装设计',
    icon: 'Layers',
    description: '时尚服饰、配饰、时装秀'
  },
  {
    id: 'architecture',
    name: '建筑设计',
    icon: 'Building2',
    description: '建筑外观、城市规划、景观'
  },
  {
    id: 'interior',
    name: '室内设计',
    icon: 'Home',
    description: '家居空间、商业空间、装饰'
  },
  {
    id: 'product',
    name: '产品设计',
    icon: 'Package',
    description: '工业设计、电子产品、家具'
  },
  {
    id: 'graphic',
    name: '平面设计',
    icon: 'Palette',
    description: '海报、Logo、品牌视觉'
  },
  {
    id: 'ui-ux',
    name: 'UI/UX设计',
    icon: 'Smartphone',
    description: '界面设计、用户体验、应用'
  },
  {
    id: 'illustration',
    name: '插画设计',
    icon: 'Paintbrush',
    description: '手绘插画、数字绘画、角色'
  },
  {
    id: 'branding',
    name: '品牌设计',
    icon: 'Award',
    description: '品牌识别、VI系统、包装'
  },
  {
    id: 'photography',
    name: '摄影艺术',
    icon: 'Camera',
    description: '商业摄影、人像、风光'
  },
  {
    id: '3d',
    name: '3D设计',
    icon: 'Box',
    description: '三维建模、渲染、动画'
  }
];

// 提示词模板
export const promptTemplates = {
  fashion: [
    {
      id: 'fashion-1',
      name: '高级时装大片',
      prompt: 'High fashion editorial photograph of a model wearing [描述服装]. Studio lighting with colored gels creating [颜色] tones. Vogue magazine style, shot on medium format camera, shallow depth of field.',
      tags: ['Editorial', 'High Fashion', 'Studio']
    },
    {
      id: 'fashion-2',
      name: '街头时尚',
      prompt: 'Street style photography of [描述人物] wearing [描述服装] in [城市/场景]. Natural lighting, candid moment, urban background. Shot with 35mm lens, f/2.8.',
      tags: ['Street Style', 'Urban', 'Casual']
    },
    {
      id: 'fashion-3',
      name: '未来主义时装',
      prompt: 'Futuristic fashion design featuring [描述服装材质和风格]. Holographic elements, metallic textures, cyberpunk aesthetic. Studio lighting, high contrast, 8K resolution.',
      tags: ['Futuristic', 'Cyberpunk', 'Avant-garde']
    },
    {
      id: 'fashion-4',
      name: '复古时尚',
      prompt: 'Vintage [年代] fashion photography. Model wearing [描述服装]. Retro color grading, film grain texture, nostalgic atmosphere. Shot on vintage film camera.',
      tags: ['Vintage', 'Retro', 'Nostalgic']
    }
  ],
  
  architecture: [
    {
      id: 'arch-1',
      name: '现代建筑',
      prompt: 'Modern [建筑类型] with clean lines, large glass windows, minimalist design. [环境描述]. Architectural photography, golden hour lighting, wide angle shot.',
      tags: ['Modern', 'Minimalist', 'Glass']
    },
    {
      id: 'arch-2',
      name: '可持续建筑',
      prompt: 'Eco-friendly [建筑类型] with vertical gardens, solar panels, green roof. Surrounded by nature. Architectural photography, natural lighting, drone perspective.',
      tags: ['Sustainable', 'Green', 'Eco-friendly']
    },
    {
      id: 'arch-3',
      name: '未来主义建筑',
      prompt: 'Futuristic [建筑类型] with organic curves, parametric design, innovative materials. [城市/环境]. Dramatic lighting, cinematic composition, 8K resolution.',
      tags: ['Futuristic', 'Parametric', 'Innovative']
    },
    {
      id: 'arch-4',
      name: '历史建筑',
      prompt: 'Historic [建筑风格] architecture from [年代/时期]. Detailed facade, ornate decorations, classical proportions. [环境描述]. Architectural photography, natural light.',
      tags: ['Historic', 'Classical', 'Heritage']
    }
  ],
  
  interior: [
    {
      id: 'interior-1',
      name: '现代极简',
      prompt: 'Modern minimalist [空间类型] with clean lines, neutral color palette, natural materials. Large windows with natural light. Scandinavian style, architectural photography.',
      tags: ['Minimalist', 'Scandinavian', 'Clean']
    },
    {
      id: 'interior-2',
      name: '工业风格',
      prompt: 'Industrial loft [空间类型] with exposed brick walls, metal beams, concrete floors. Edison bulb lighting, vintage furniture. Urban aesthetic, moody atmosphere.',
      tags: ['Industrial', 'Loft', 'Urban']
    },
    {
      id: 'interior-3',
      name: '奢华风格',
      prompt: 'Luxury [空间类型] with marble surfaces, gold accents, crystal chandelier. Elegant furniture, rich textures. High-end interior design, dramatic lighting.',
      tags: ['Luxury', 'Elegant', 'High-end']
    },
    {
      id: 'interior-4',
      name: '温馨舒适',
      prompt: 'Cozy [空间类型] with warm lighting, soft textiles, natural wood. Plants and personal touches. Hygge aesthetic, inviting atmosphere, natural light.',
      tags: ['Cozy', 'Hygge', 'Warm']
    }
  ],
  
  product: [
    {
      id: 'product-1',
      name: '产品摄影',
      prompt: 'Professional product photography of [产品名称]. Clean white background, studio lighting, multiple angles. Commercial photography style, high resolution, sharp details.',
      tags: ['Commercial', 'Studio', 'Clean']
    },
    {
      id: 'product-2',
      name: '生活场景',
      prompt: '[产品名称] in lifestyle setting. [使用场景描述]. Natural lighting, authentic moment, lifestyle photography. Shot with 50mm lens.',
      tags: ['Lifestyle', 'Natural', 'Authentic']
    },
    {
      id: 'product-3',
      name: '科技产品',
      prompt: 'Sleek [电子产品] with modern design. Floating on gradient background, dramatic lighting, reflections. Tech product photography, futuristic aesthetic.',
      tags: ['Tech', 'Modern', 'Futuristic']
    },
    {
      id: 'product-4',
      name: '手工艺品',
      prompt: 'Handcrafted [产品类型] with artisanal details. Natural materials, textured surface. Warm lighting, rustic background, close-up shot showing craftsmanship.',
      tags: ['Handmade', 'Artisanal', 'Craft']
    }
  ],
  
  graphic: [
    {
      id: 'graphic-1',
      name: '海报设计',
      prompt: 'Minimalist poster design for [主题]. Bold typography, [颜色方案], geometric shapes. Modern graphic design, clean composition, high contrast.',
      tags: ['Poster', 'Typography', 'Minimalist']
    },
    {
      id: 'graphic-2',
      name: 'Logo设计',
      prompt: 'Modern logo design for [品牌名称]. [风格描述], simple and memorable. Vector style, clean lines, professional branding.',
      tags: ['Logo', 'Branding', 'Vector']
    },
    {
      id: 'graphic-3',
      name: '信息图表',
      prompt: 'Infographic showing [主题/数据]. Clean vector art, [颜色方案], clear hierarchy. Educational design, easy to understand, modern style.',
      tags: ['Infographic', 'Data Viz', 'Educational']
    },
    {
      id: 'graphic-4',
      name: '杂志封面',
      prompt: 'Magazine cover design for [主题]. Bold headline "[标题]" in [字体风格]. [视觉元素描述]. Editorial design, high-end aesthetic.',
      tags: ['Magazine', 'Editorial', 'Typography']
    }
  ],
  
  'ui-ux': [
    {
      id: 'ui-1',
      name: '移动应用界面',
      prompt: 'Modern mobile app UI design for [应用类型]. Clean interface, [颜色方案], intuitive navigation. iOS/Android style, user-friendly, contemporary design.',
      tags: ['Mobile', 'App', 'UI']
    },
    {
      id: 'ui-2',
      name: '网站界面',
      prompt: 'Website landing page design for [网站类型]. Hero section with [描述], clear CTA buttons, modern layout. Responsive design, clean typography.',
      tags: ['Web', 'Landing Page', 'Responsive']
    },
    {
      id: 'ui-3',
      name: '仪表盘',
      prompt: 'Dashboard UI design showing [数据类型]. Data visualization, charts and graphs, dark mode interface. Professional design, clear information hierarchy.',
      tags: ['Dashboard', 'Data Viz', 'Dark Mode']
    },
    {
      id: 'ui-4',
      name: '游戏界面',
      prompt: 'Game UI design for [游戏类型]. [风格描述] aesthetic, HUD elements, menu screens. Immersive design, fantasy/sci-fi style.',
      tags: ['Game', 'HUD', 'Interactive']
    }
  ],
  
  illustration: [
    {
      id: 'illust-1',
      name: '扁平插画',
      prompt: 'Flat illustration of [主题]. Simple shapes, [颜色方案], minimal details. Modern vector style, clean and friendly aesthetic.',
      tags: ['Flat', 'Vector', 'Simple']
    },
    {
      id: 'illust-2',
      name: '手绘风格',
      prompt: 'Hand-drawn illustration of [主题]. Sketch-like lines, watercolor textures, organic feel. Artistic style, warm and personal.',
      tags: ['Hand-drawn', 'Sketch', 'Organic']
    },
    {
      id: 'illust-3',
      name: '角色设计',
      prompt: 'Character design of [角色描述]. [风格] style, expressive features, dynamic pose. Full body illustration, character sheet format.',
      tags: ['Character', 'Concept Art', 'Design']
    },
    {
      id: 'illust-4',
      name: '场景插画',
      prompt: 'Detailed illustration of [场景描述]. [风格] aesthetic, atmospheric lighting, rich colors. Concept art style, cinematic composition.',
      tags: ['Scene', 'Environment', 'Atmospheric']
    }
  ],
  
  branding: [
    {
      id: 'brand-1',
      name: '品牌识别系统',
      prompt: 'Brand identity system for [品牌名称]. Logo variations, color palette, typography guidelines. Professional branding, cohesive visual system.',
      tags: ['Identity', 'System', 'Guidelines']
    },
    {
      id: 'brand-2',
      name: '包装设计',
      prompt: 'Product packaging design for [产品]. [风格描述], [颜色方案], brand logo placement. Mockup on [背景], professional photography.',
      tags: ['Packaging', 'Product', 'Mockup']
    },
    {
      id: 'brand-3',
      name: '品牌应用',
      prompt: 'Brand application mockups showing [品牌名称] on [应用场景]. Business cards, letterhead, merchandise. Consistent branding, professional presentation.',
      tags: ['Mockup', 'Application', 'Stationery']
    },
    {
      id: 'brand-4',
      name: '社交媒体',
      prompt: 'Social media branding for [品牌]. Instagram post templates, story designs, [风格描述]. Consistent visual identity, engaging design.',
      tags: ['Social Media', 'Templates', 'Digital']
    }
  ],
  
  photography: [
    {
      id: 'photo-1',
      name: '人像摄影',
      prompt: 'Portrait photography of [人物描述]. [光线描述] lighting, [背景描述]. Shot with 85mm lens, f/1.8, shallow depth of field.',
      tags: ['Portrait', 'People', 'Studio']
    },
    {
      id: 'photo-2',
      name: '风光摄影',
      prompt: 'Landscape photography of [场景描述]. [时间/天气] lighting, dramatic sky, vivid colors. Wide angle shot, long exposure, professional photography.',
      tags: ['Landscape', 'Nature', 'Scenic']
    },
    {
      id: 'photo-3',
      name: '美食摄影',
      prompt: 'Food photography of [食物]. Overhead shot, natural lighting, rustic background. Appetizing presentation, shallow depth of field, professional styling.',
      tags: ['Food', 'Culinary', 'Styling']
    },
    {
      id: 'photo-4',
      name: '黑白摄影',
      prompt: 'Black and white photography of [主题]. High contrast, dramatic lighting, strong composition. Film noir aesthetic, timeless style.',
      tags: ['B&W', 'Monochrome', 'Dramatic']
    }
  ],
  
  '3d': [
    {
      id: '3d-1',
      name: '产品渲染',
      prompt: '3D render of [产品]. Photorealistic materials, studio lighting, clean background. Octane render, 8K resolution, professional product visualization.',
      tags: ['3D', 'Render', 'Product']
    },
    {
      id: '3d-2',
      name: '抽象3D',
      prompt: 'Abstract 3D composition with [形状/元素]. [颜色方案], smooth gradients, floating objects. Cinema 4D style, modern aesthetic, high quality render.',
      tags: ['Abstract', '3D', 'Modern']
    },
    {
      id: '3d-3',
      name: '角色建模',
      prompt: '3D character model of [角色描述]. Detailed textures, realistic materials, [风格] style. Full body render, turnaround view, professional modeling.',
      tags: ['Character', '3D Model', 'Detailed']
    },
    {
      id: '3d-4',
      name: '场景建模',
      prompt: '3D environment of [场景描述]. Detailed architecture, atmospheric lighting, [风格] aesthetic. Unreal Engine quality, cinematic render.',
      tags: ['Environment', 'Scene', 'Architectural']
    }
  ]
};

// 内容创作分类
export const contentCategories = [
  { id: 'blog', name: '博客配图', icon: 'FileText', description: '文章插图、封面图' },
  { id: 'social', name: '社交媒体', icon: 'Share2', description: 'Instagram、小红书' },
  { id: 'presentation', name: '演示文稿', icon: 'Presentation', description: 'PPT、Keynote' },
  { id: 'ebook', name: '电子书', icon: 'BookOpen', description: '封面、内页插图' }
];

// 教育科普分类
export const educationCategories = [
  { id: 'infographic', name: '信息图表', icon: 'BarChart', description: '数据可视化、流程图' },
  { id: 'science', name: '科学插图', icon: 'Atom', description: '生物、化学、物理' },
  { id: 'history', name: '历史场景', icon: 'Clock', description: '历史事件、人物' },
  { id: 'geography', name: '地理地图', icon: 'Map', description: '地形、气候、城市' }
];

// 生活方式分类
export const lifestyleCategories = [
  { id: 'food', name: '美食摄影', icon: 'UtensilsCrossed', description: '菜品、餐厅、烹饪' },
  { id: 'travel', name: '旅行风光', icon: 'Plane', description: '景点、城市、自然' },
  { id: 'home', name: '家居生活', icon: 'Home', description: '装饰、收纳、DIY' },
  { id: 'fitness', name: '健身运动', icon: 'Dumbbell', description: '瑜伽、健身、户外' }
];

// 商业营销分类
export const businessCategories = [
  { id: 'ad', name: '广告创意', icon: 'Megaphone', description: '海报、横幅、广告' },
  { id: 'ecommerce', name: '电商产品', icon: 'ShoppingCart', description: '主图、详情页' },
  { id: 'corporate', name: '企业形象', icon: 'Building', description: '宣传册、年报' },
  { id: 'event', name: '活动宣传', icon: 'Calendar', description: '邀请函、海报' }
];

// 娱乐媒体分类
export const entertainmentCategories = [
  { id: 'movie', name: '影视概念', icon: 'Film', description: '场景、角色、道具' },
  { id: 'game', name: '游戏美术', icon: 'Gamepad2', description: '角色、场景、UI' },
  { id: 'anime', name: '动漫插画', icon: 'Sparkles', description: '角色、漫画、同人' },
  { id: 'music', name: '音乐视觉', icon: 'Music', description: '专辑封面、MV' }
];

// 领域到分类的映射
export const domainCategoriesMap: Record<string, any[]> = {
  design: designCategories,
  content: contentCategories,
  education: educationCategories,
  lifestyle: lifestyleCategories,
  business: businessCategories,
  entertainment: entertainmentCategories
};
