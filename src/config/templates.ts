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
      prompt: 'Vintage [年代] fashion photography shot on [Kodak Portra 400/Fuji Velvia 50] film stock, authentic period color science, natural film grain, subtle light leaks, nostalgic atmosphere. Model wearing [描述服装]. Candid moment, shallow depth of field, 8K resolution, ultra-detailed, sharp edges, professional quality, no artifacts. Support --seed parameter for consistent output, reference image style matching available.',
      tags: ['Vintage', 'Retro', 'Nostalgic', 'Film']
    },
    {
      id: 'fashion-5',
      name: '可动人偶肖像',
      prompt: 'Funko Pop style action figure of [人物描述], standing in a clear plastic display box, premium paint details, realistic plastic texture, studio lighting, white background, product photography, 8K resolution, ultra-detailed, no artifacts. Commercial use allowed.',
      tags: ['Action Figure', 'Viral', 'Funko', 'Social Media']
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
      prompt: 'Professional commercial product photography of [产品名称], shot on Sony A7R IV, softbox studio lighting, crisp focus on product details, subtle reflections, clean white background, no shadows, 8K resolution, photorealistic, ready for e-commerce use. Support generative fill for background replacement, --seed parameter for consistent output. Commercial use allowed, no copyright issues.',
      tags: ['Commercial', 'Studio', 'Clean', 'E-commerce']
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
  ],
  
  // 内容创作模板
  blog: [
    {
      id: 'blog-1',
      name: '博客封面图',
      prompt: 'Blog post cover image for [主题]. Minimalist design with [视觉元素], bold typography "[标题]", clean layout. Modern editorial style, social media ready.',
      tags: ['Blog', 'Cover', 'Editorial']
    },
    {
      id: 'blog-2',
      name: '文章配图',
      prompt: 'Editorial illustration for blog article about [主题]. [风格] style, [颜色方案], informative yet artistic. Vector art, clean lines, modern aesthetic.',
      tags: ['Illustration', 'Editorial', 'Vector']
    },
    {
      id: 'blog-3',
      name: '教程图解',
      prompt: 'Step-by-step tutorial illustration for [主题]. Numbered steps, clear icons, [颜色方案]. Educational design, easy to follow, infographic style.',
      tags: ['Tutorial', 'Educational', 'Infographic']
    },
    {
      id: 'blog-4',
      name: '观点图',
      prompt: 'Quote graphic for blog. Bold typography "[引言]" by [作者]. [风格] background, modern design. Instagram post format, engaging visual.',
      tags: ['Quote', 'Social', 'Typography']
    }
  ],
  
  social: [
    {
      id: 'social-1',
      name: 'Instagram帖子',
      prompt: 'Instagram post for [主题]. [风格] aesthetic, [颜色方案], eye-catching design. Square format, engaging visual, modern social media style.',
      tags: ['Instagram', 'Social', 'Square']
    },
    {
      id: 'social-2',
      name: '小红书配图',
      prompt: 'Xiaohongshu viral lifestyle post about [主题]. Warm Kodak Gold 200 film aesthetic, soft natural lighting, cozy atmosphere, vertical 9:16 format, subtle film grain, trending composition, ultra-detailed, optimized for mobile viewing. Supports one-click editing in browser, --seed parameter for consistent series content. Commercial use allowed.',
      tags: ['Xiaohongshu', 'Lifestyle', 'Vertical', 'Viral']
    },
    {
      id: 'social-5',
      name: '超现实主义迷因',
      prompt: 'Surreal meme image of [场景/人物], absurd and funny, viral social media style, high contrast, bold colors, 1:1 square format, optimized for Instagram/TikTok sharing, 8K resolution, ultra-detailed. Commercial use allowed.',
      tags: ['Meme', 'Viral', 'Social Media', 'Funny']
    },
    {
      id: 'social-3',
      name: 'Stories素材',
      prompt: 'Social media story for [主题]. Full screen design, [颜色方案], bold text overlay. Vertical format, engaging visuals, swipe-up call-to-action.',
      tags: ['Stories', 'Vertical', 'Engaging']
    },
    {
      id: 'social-4',
      name: '头像/封面',
      prompt: 'Social media profile banner for [账号/品牌]. [风格] design, [颜色方案], memorable visual. Horizontal format, professional look.',
      tags: ['Banner', 'Profile', 'Branding']
    }
  ],
  
  presentation: [
    {
      id: 'present-1',
      name: 'PPT封面',
      prompt: 'Professional PowerPoint cover slide for [主题]. [风格] design, [颜色方案], clean layout. Corporate presentation style, modern business aesthetic.',
      tags: ['Presentation', 'Cover', 'Corporate']
    },
    {
      id: 'present-2',
      name: '数据图表',
      prompt: 'Data visualization slide for [主题]. Clean charts and graphs, [颜色方案], professional styling. Business presentation, easy to understand, modern design.',
      tags: ['Data', 'Charts', 'Business']
    },
    {
      id: 'present-3',
      name: '流程图',
      prompt: 'Process flow diagram for [主题]. Clean icons, arrows, [颜色方案]. Step-by-step visualization, corporate presentation style, professional design.',
      tags: ['Flowchart', 'Process', 'Diagram']
    },
    {
      id: 'present-4',
      name: '结束页',
      prompt: 'Presentation closing slide for [主题]. Thank you message, [风格] design, [颜色方案]. Professional ending, contact info, modern corporate style.',
      tags: ['Closing', 'Thank You', 'Professional']
    }
  ],
  
  ebook: [
    {
      id: 'ebook-1',
      name: '电子书封面',
      prompt: 'Ebook cover design for [书名]. [风格] aesthetic, [颜色方案], bold title typography. Professional publishing quality, eye-catching design, digital format.',
      tags: ['Ebook', 'Cover', 'Publishing']
    },
    {
      id: 'ebook-2',
      name: '章节插图',
      prompt: 'Chapter illustration for ebook about [主题]. [风格] style, [颜色方案], atmospheric design. Digital publishing, engaging visual, modern aesthetic.',
      tags: ['Chapter', 'Illustration', 'Digital']
    },
    {
      id: 'ebook-3',
      name: '信息图表',
      prompt: 'Ebook infographic about [主题]. Educational content, [颜色方案], clear data visualization. Modern design, easy to read, digital publishing style.',
      tags: ['Infographic', 'Educational', 'Data']
    },
    {
      id: 'ebook-4',
      name: '作者头像',
      prompt: 'Professional author photo illustration for [书名/作者]. Stylish portrait, [风格] aesthetic, [颜色方案]. Digital publishing, professional branding.',
      tags: ['Author', 'Portrait', 'Branding']
    }
  ],
  
  // 教育科普模板
  infographic: [
    {
      id: 'info-1',
      name: '数据可视化',
      prompt: 'Data visualization infographic about [主题]. Charts, graphs, [颜色方案], clear hierarchy. Educational design, easy to understand, modern style.',
      tags: ['Data', 'Visualization', 'Educational']
    },
    {
      id: 'info-2',
      name: '流程图',
      prompt: 'Process infographic showing [主题] step by step. Numbered steps, icons, [颜色方案]. Clean design, educational content, modern aesthetic.',
      tags: ['Process', 'Flowchart', 'Steps']
    },
    {
      id: 'info-3',
      name: '比较图',
      prompt: 'Comparison infographic: [主题A] vs [主题B]. Side by side layout, [颜色方案], pros and cons. Educational design, clear visualization.',
      tags: ['Comparison', 'Educational', 'Analysis']
    },
    {
      id: 'info-4',
      name: '时间线',
      prompt: 'Timeline infographic of [主题]. Historical events, dates, [颜色方案]. Vertical or horizontal layout, educational design, clear chronology.',
      tags: ['Timeline', 'History', 'Chronology']
    }
  ],
  
  science: [
    {
      id: 'sci-1',
      name: '科学插图',
      prompt: 'Scientific illustration of [科学概念]. Accurate details, [颜色方案], educational style. Textbook quality, clean rendering, anatomical or technical accuracy.',
      tags: ['Scientific', 'Educational', 'Accurate']
    },
    {
      id: 'sci-2',
      name: '分子结构',
      prompt: 'Molecular structure visualization of [分子/化合物]. [颜色方案] atoms and bonds, scientific accuracy, 3D rendering. Educational material, chemistry illustration.',
      tags: ['Molecular', 'Chemistry', '3D']
    },
    {
      id: 'sci-3',
      name: '人体解剖',
      prompt: 'Anatomical illustration of [身体部位/系统]. Medical accuracy, [颜色方案], educational style. Textbook quality, detailed labeling, scientific visualization.',
      tags: ['Anatomy', 'Medical', 'Educational']
    },
    {
      id: 'sci-4',
      name: '实验图示',
      prompt: 'Scientific experiment diagram for [实验名称]. Lab equipment, procedure steps, [颜色方案]. Educational design, clear visualization, science textbook style.',
      tags: ['Experiment', 'Lab', 'Diagram']
    }
  ],
  
  history: [
    {
      id: 'hist-1',
      name: '历史场景',
      prompt: 'Historical scene illustration of [历史事件/时期]. Accurate period details, [风格] aesthetic, [颜色方案]. Educational content, cinematic composition.',
      tags: ['History', 'Scene', 'Period']
    },
    {
      id: 'hist-2',
      name: '历史人物',
      prompt: 'Historical portrait of [历史人物]. Period-accurate clothing, [风格] aesthetic, [颜色方案]. Educational illustration, museum quality, detailed rendering.',
      tags: ['Portrait', 'Historical', 'Period']
    },
    {
      id: 'hist-3',
      name: '古代文物',
      prompt: 'Illustration of ancient artifact [文物类型]. Historical accuracy, [风格] aesthetic, [颜色方案]. Museum display, educational content, detailed design.',
      tags: ['Artifact', 'Museum', 'Historical']
    },
    {
      id: 'hist-4',
      name: '历史地图',
      prompt: 'Historical map of [地区/时期]. Period-accurate details, [风格] aesthetic, [颜色方案]. Educational content, vintage cartography style.',
      tags: ['Map', 'Historical', 'Cartography']
    }
  ],
  
  geography: [
    {
      id: 'geo-1',
      name: '地图可视化',
      prompt: 'Geographic map of [地区]. Clear boundaries, [颜色方案], modern cartography style. Educational content, detailed topography, digital format.',
      tags: ['Map', 'Geographic', 'Cartography']
    },
    {
      id: 'geo-2',
      name: '地形图',
      prompt: 'Topographic map of [地形类型]. Elevation contours, [颜色方案], terrain visualization. Educational content, accurate representation, modern style.',
      tags: ['Topography', 'Terrain', ' Relief']
    },
    {
      id: 'geo-3',
      name: '气候图',
      prompt: 'Climate visualization showing [气候类型/地区]. Temperature zones, weather patterns, [颜色方案]. Educational infographic, scientific accuracy, modern design.',
      tags: ['Climate', 'Weather', 'Data']
    },
    {
      id: 'geo-4',
      name: '城市地图',
      prompt: 'City map of [城市]. Landmarks, transportation, [颜色方案], modern cartography. Urban planning visualization, tourist-friendly design, clear layout.',
      tags: ['City', 'Urban', 'Map']
    }
  ],
  
  // 生活方式模板
  food: [
    {
      id: 'food-1',
      name: '美食摄影',
      prompt: 'Professional food photography of [菜品]. Appetizing presentation, natural lighting, [背景描述]. Culinary photography, shallow depth of field, restaurant quality.',
      tags: ['Food', 'Photography', 'Culinary']
    },
    {
      id: 'food-2',
      name: '菜单设计',
      prompt: 'Restaurant menu design for [餐厅类型]. [风格] aesthetic, [颜色方案], food photography. Professional layout, elegant typography, modern dining style.',
      tags: ['Menu', 'Restaurant', 'Design']
    },
    {
      id: 'food-3',
      name: '烹饪图解',
      prompt: 'Cooking illustration showing [菜名] preparation. Step-by-step visuals, ingredients layout, [颜色方案]. Recipe card design, educational content, clean style.',
      tags: ['Recipe', 'Cooking', 'Tutorial']
    },
    {
      id: 'food-4',
      name: '食材摄影',
      prompt: 'Fresh ingredients photography of [食材]. Natural lighting, rustic background, [颜色方案]. Culinary photography, market quality, authentic feel.',
      tags: ['Ingredients', 'Fresh', 'Natural']
    }
  ],
  
  travel: [
    {
      id: 'travel-1',
      name: '旅行风光',
      prompt: 'Travel photography of [目的地]. [时间] lighting, [天气描述], iconic landmark. Landscape quality, professional composition, wanderlust inspiring.',
      tags: ['Travel', 'Landscape', 'Destination']
    },
    {
      id: 'travel-2',
      name: '旅行攻略图',
      prompt: 'Travel itinerary map for [目的地/路线]. Landmarks, routes, [颜色方案], modern design. Trip planning infographic, engaging visual, tourist-friendly style.',
      tags: ['Itinerary', 'Map', 'Planning']
    },
    {
      id: 'travel-3',
      name: '酒店宣传',
      prompt: 'Hotel promotional image for [酒店名称]. Luxury interior, [颜色方案], professional photography. Hospitality marketing, inviting atmosphere, modern aesthetic.',
      tags: ['Hotel', 'Hospitality', 'Luxury']
    },
    {
      id: 'travel-4',
      name: '明信片',
      prompt: 'Travel postcard design for [目的地]. Iconic landmark, [风格] aesthetic, [颜色方案]. Vintage or modern postcard style, souvenir quality, memorable design.',
      tags: ['Postcard', 'Souvenir', 'Travel']
    }
  ],
  
  home: [
    {
      id: 'home-1',
      name: '家居美图',
      prompt: 'Interior design photo of [空间描述]. [风格] aesthetic, [颜色方案], natural lighting. Home decor magazine quality, inspiring living spaces, professional photography.',
      tags: ['Interior', 'Home', 'Decor']
    },
    {
      id: 'home-2',
      name: '收纳方案',
      prompt: 'Home organization solution for [空间]. Before/after comparison, [颜色方案], clean design. DIY tutorial style, practical content, engaging visual.',
      tags: ['Organization', 'DIY', 'Practical']
    },
    {
      id: 'home-3',
      name: 'DIY教程',
      prompt: 'DIY project tutorial for [手工项目]. Step-by-step visuals, materials list, [颜色方案]. Craft tutorial style, educational content, hands-on aesthetic.',
      tags: ['DIY', 'Craft', 'Tutorial']
    },
    {
      id: 'home-4',
      name: '装饰画',
      prompt: 'Wall art print design for [风格] home decor. [主题描述], [颜色方案], ready-to-print quality. Modern interior design, artistic aesthetic, gallery quality.',
      tags: ['Art', 'Decor', 'Wall']
    }
  ],
  
  fitness: [
    {
      id: 'fit-1',
      name: '健身动作',
      prompt: 'Fitness exercise illustration showing [动作名称]. Clear anatomy, [颜色方案], instructional design. Workout guide style, educational content, professional rendering.',
      tags: ['Fitness', 'Exercise', 'Workout']
    },
    {
      id: 'fit-2',
      name: '瑜伽体式',
      prompt: 'Yoga pose illustration of [体式名称]. Peaceful setting, [颜色方案], serene aesthetic. Wellness content, calming design, instructional quality.',
      tags: ['Yoga', 'Wellness', 'Pose']
    },
    {
      id: 'fit-3',
      name: '健身计划',
      prompt: 'Fitness plan infographic for [目标]. Weekly schedule, exercises, [颜色方案]. Workout program design, motivational content, modern style.',
      tags: ['Plan', 'Workout', 'Schedule']
    },
    {
      id: 'fit-4',
      name: '运动摄影',
      prompt: 'Action sports photography of [运动项目]. Dynamic pose, [光线描述] lighting, [背景描述]. Athletic photography, energetic feel, professional quality.',
      tags: ['Sports', 'Action', 'Athletic']
    }
  ],
  
  // 商业营销模板
  ad: [
    {
      id: 'ad-1',
      name: '广告海报',
      prompt: 'Print advertisement for [产品/服务]. Bold visual, [风格] aesthetic, [颜色方案]. Creative campaign, professional design, eye-catching layout.',
      tags: ['Advertisement', 'Poster', 'Creative']
    },
    {
      id: 'ad-2',
      name: '数字广告',
      prompt: 'Digital ad banner for [产品/活动]. [尺寸描述], [颜色方案], compelling CTA. Online advertising, modern design, click-worthy visual.',
      tags: ['Digital', 'Banner', 'Online']
    },
    {
      id: 'ad-3',
      name: '品牌广告',
      prompt: 'Brand advertising campaign for [品牌]. [风格] aesthetic, [颜色方案], emotional appeal. Corporate marketing, professional quality, memorable design.',
      tags: ['Brand', 'Marketing', 'Campaign']
    },
    {
      id: 'ad-4',
      name: '户外广告',
      prompt: 'Outdoor billboard advertisement for [产品/品牌]. Large format design, [风格] aesthetic, [颜色方案]. Billboard marketing, high impact, roadside quality.',
      tags: ['Billboard', 'Outdoor', 'Large Format']
    }
  ],
  
  ecommerce: [
    {
      id: 'ecom-1',
      name: '电商主图',
      prompt: 'E-commerce product listing image for [产品]. White background, professional lighting, [颜色方案]. Amazon/Shopify ready, clean design, conversion-focused.',
      tags: ['Ecommerce', 'Product', 'Listing']
    },
    {
      id: 'ecom-2',
      name: '详情页横幅',
      prompt: 'E-commerce banner for [产品类别]. [风格] design, [颜色方案], promotional content. Hero image, landing page quality, sales-driven aesthetic.',
      tags: ['Banner', 'Landing', 'Sales']
    },
    {
      id: 'ecom-3',
      name: '产品场景图',
      prompt: 'Lifestyle product shot of [产品] in [使用场景]. Natural setting, [颜色方案], aspirational appeal. E-commerce quality, authentic marketing, modern style.',
      tags: ['Lifestyle', 'Scene', 'Marketing']
    },
    {
      id: 'ecom-4',
      name: '促销图形',
      prompt: 'Sales promotion graphics for [活动/节日]. [风格] design, [颜色方案], urgent messaging. E-commerce ready, social media optimized, conversion focus.',
      tags: ['Promotion', 'Sales', 'Discount']
    }
  ],
  
  corporate: [
    {
      id: 'corp-1',
      name: '宣传册',
      prompt: 'Corporate brochure design for [公司/服务]. [风格] aesthetic, [颜色方案], professional layout. Business marketing, clean design, corporate identity.',
      tags: ['Brochure', 'Corporate', 'Marketing']
    },
    {
      id: 'corp-2',
      name: '年报设计',
      prompt: 'Annual report cover for [公司名称]. [风格] design, [颜色方案], professional presentation. Corporate communication, investor relations, clean aesthetic.',
      tags: ['Report', 'Annual', 'Corporate']
    },
    {
      id: 'corp-3',
      name: '名片设计',
      prompt: 'Business card design for [职位/公司]. [风格] aesthetic, [颜色方案], professional typography. Corporate identity, clean layout, memorable design.',
      tags: ['Business Card', 'Identity', 'Professional']
    },
    {
      id: 'corp-4',
      name: '公司介绍',
      prompt: 'Company introduction slide for [公司名称]. [风格] design, [颜色方案], corporate storytelling. Pitch deck, investor presentation, modern aesthetic.',
      tags: ['Presentation', 'Company', 'Pitch']
    }
  ],
  
  event: [
    {
      id: 'event-1',
      name: '活动海报',
      prompt: 'Event poster for [活动名称]. [风格] aesthetic, [颜色方案], date and details. Concert, conference, or meetup promotion, eye-catching design.',
      tags: ['Poster', 'Event', 'Promotion']
    },
    {
      id: 'event-2',
      name: '邀请函',
      prompt: 'Event invitation design for [活动类型]. [风格] aesthetic, [颜色方案], elegant typography. Digital or print ready, formal event, sophisticated design.',
      tags: ['Invitation', 'Event', 'Formal']
    },
    {
      id: 'event-3',
      name: '入场券',
      prompt: 'Event ticket design for [活动名称]. [风格] aesthetic, [颜色方案], QR code area. Concert or conference ticket, collectible design, modern style.',
      tags: ['Ticket', 'Event', 'Design']
    },
    {
      id: 'event-4',
      name: '签到处',
      prompt: 'Event sign and wayfinding design for [活动]. [风格] aesthetic, [颜色方案], clear typography. Directional signage, professional event coordination, practical design.',
      tags: ['Signage', 'Wayfinding', 'Event']
    }
  ],
  
  // 娱乐媒体模板
  movie: [
    {
      id: 'movie-1',
      name: '电影概念图',
      prompt: 'Movie concept art for [电影场景]. [风格] aesthetic, [颜色方案], cinematic lighting. Film pre-production, mood setting, professional concept quality.',
    },
    {
      id: 'movie-2',
      name: '角色海报',
      prompt: 'Movie poster for [电影/角色]. [风格] design, [颜色方案], dramatic typography. Film marketing, character focus, theatrical release quality.',
      tags: ['Poster', 'Character', 'Film']
    },
    {
      id: 'movie-3',
      name: '道具设计',
      prompt: 'Prop design for [电影/剧集]. [风格] aesthetic, [颜色方案], detailed rendering. Film production, authentic look, practical design quality.',
      tags: ['Prop', 'Film', 'Design']
    },
    {
      id: 'movie-4',
      name: '片头设计',
      prompt: 'Title sequence concept for [电影/剧集]. [风格] aesthetic, [颜色方案], motion graphics ready. Opening credits, cinematic feel, professional design.',
      tags: ['Title Sequence', 'Credits', 'Cinematic']
    }
  ],
  
  game: [
    {
      id: 'game-1',
      name: '游戏角色',
      prompt: 'Game character design for [游戏类型]. [风格] style, [颜色方案], game-ready rendering. Character concept, RPG or FPS quality, detailed design.',
      tags: ['Character', 'Game', 'Concept']
    },
    {
      id: 'game-2',
      name: '游戏场景',
      prompt: 'Game environment art for [场景描述]. [风格] aesthetic, [颜色方案], atmospheric lighting. Level design, immersive world, professional game art.',
      tags: ['Environment', 'Game', 'Level']
    },
    {
      id: 'game-3',
      name: '游戏UI',
      prompt: 'Game UI design for [游戏类型]. [风格] aesthetic, [颜色方案], HUD elements. User interface, in-game menus, functional design, gaming quality.',
      tags: ['UI', 'Game', 'Interface']
    },
    {
      id: 'game-4',
      name: '游戏图标',
      prompt: 'Game icon design for [应用/模式]. [风格] aesthetic, [颜色方案], recognizable at small size. App icon, game launcher, mobile or desktop quality.',
      tags: ['Icon', 'Game', 'Mobile']
    }
  ],
  
  anime: [
    {
      id: 'anime-1',
      name: '动漫角色',
      prompt: 'Anime character illustration of [角色描述]. [风格] anime style, [颜色方案], expressive pose. Manga quality, fan art, detailed character design.',
      tags: ['Anime', 'Character', 'Manga']
    },
    {
      id: 'anime-2',
      name: '动漫场景',
      prompt: 'Anime style illustration of [场景描述]. [风格] aesthetic, [颜色方案], atmospheric background. Manga scene, background art, detailed environment.',
      tags: ['Anime', 'Scene', 'Background']
    },
    {
      id: 'anime-3',
      name: '同人作品',
      prompt: 'Fan art illustration of [角色/作品]. [风格] anime style, [颜色方案], high quality rendering. Doujinshi quality, popular character, detailed artwork.',
      tags: ['Fan Art', 'Doujinshi', 'Anime']
    },
    {
      id: 'anime-4',
      name: '漫画分镜',
      prompt: 'Manga panel layout for [情节描述]. [风格] anime style, [颜色方案], action sequence. Comic page, storyboard, manga panel composition.',
      tags: ['Manga', 'Panel', 'Comic']
    }
  ],
  
  music: [
    {
      id: 'music-1',
      name: '专辑封面',
      prompt: 'Album cover art for [音乐人/专辑]. [风格] aesthetic, [颜色方案], memorable visual. Record sleeve, digital release, professional music marketing.',
      tags: ['Album Cover', 'Music', 'Artwork']
    },
    {
      id: 'music-2',
      name: '演出海报',
      prompt: 'Concert poster for [艺人/活动]. [风格] design, [颜色方案], energetic typography. Live music promotion, tour announcement, event quality.',
      tags: ['Concert', 'Poster', 'Live']
    },
    {
      id: 'music-3',
      name: 'MV画面',
      prompt: 'Music video frame for [歌曲/艺人]. [风格] aesthetic, [颜色方案], cinematic composition. Live performance or concept video, visual album quality.',
      tags: ['Music Video', 'Visual', 'Concept']
    },
    {
      id: 'music-4',
      name: '音乐图标',
      prompt: 'Music streaming icon for [艺人/歌单]. [风格] design, [颜色方案], recognizable at small size. App icon, playlist cover, digital music platform quality.',
      tags: ['Icon', 'Music', 'Streaming']
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
