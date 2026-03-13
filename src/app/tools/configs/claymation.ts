import { ToolConfig } from '../types';

export const claymationConfig: ToolConfig = {
  id: 'claymation',
  presets: [
    { 
      id: 'classic', 
      name: '经典黏土 🎨', 
      description: 'Wallace & Gromit 风格', 
      params: { style: 'classic', texture: 'matte', lighting: 'soft' } 
    },
    { 
      id: 'modern', 
      name: '现代黏土 ✨', 
      description: 'Shaun the Sheep 风格', 
      params: { style: 'modern', texture: 'smooth', lighting: 'bright' } 
    },
    { 
      id: 'coraline', 
      name: '鬼妈妈风格 🌙', 
      description: '暗黑哥特黏土动画', 
      params: { style: 'coraline', texture: 'detailed', lighting: 'dramatic' } 
    },
    { 
      id: 'chicken-run', 
      name: '小鸡快跑 🐔', 
      description: '幽默喜剧黏土风格', 
      params: { style: 'chicken-run', texture: 'matte', lighting: 'natural' } 
    },
    { 
      id: 'kubo', 
      name: 'Kubo 风格 🎭', 
      description: '精致手工黏土动画', 
      params: { style: 'kubo', texture: 'detailed', lighting: 'cinematic' } 
    }
  ],
  params: [
    { 
      id: 'style', 
      name: '黏土风格', 
      type: 'select', 
      default: 'classic', 
      options: [
        { value: 'classic', label: '经典黏土 (Wallace & Gromit)' },
        { value: 'modern', label: '现代黏土 (Shaun the Sheep)' },
        { value: 'coraline', label: '鬼妈妈风格 (暗黑哥特)' },
        { value: 'chicken-run', label: '小鸡快跑 (幽默喜剧)' },
        { value: 'kubo', label: 'Kubo (精致手工)' }
      ]
    },
    { 
      id: 'texture', 
      name: '材质质感', 
      type: 'select', 
      default: 'matte', 
      options: [
        { value: 'matte', label: '哑光黏土' },
        { value: 'smooth', label: '光滑黏土' },
        { value: 'detailed', label: '细节纹理' },
        { value: 'rough', label: '粗糙手工' }
      ]
    },
    {
      id: 'lighting',
      name: '光照效果',
      type: 'select',
      default: 'soft',
      options: [
        { value: 'soft', label: '柔和光照' },
        { value: 'bright', label: '明亮光照' },
        { value: 'dramatic', label: '戏剧光照' },
        { value: 'natural', label: '自然光照' },
        { value: 'cinematic', label: '电影光照' }
      ]
    },
    {
      id: 'detailLevel',
      name: '细节程度',
      type: 'slider',
      default: 80,
      min: 60,
      max: 100,
      description: '黏土纹理和手工痕迹的细节'
    }
  ]
};
