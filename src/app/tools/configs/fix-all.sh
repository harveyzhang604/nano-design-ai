#!/bin/bash

# 1. change-bg - 添加 background 参数
cat > change-bg.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const changeBgConfig: ToolConfig = {
  id: 'change-bg',
  presets: [
    { id: 'nature', name: '自然风光', description: '山川湖海背景', params: { background: '美丽的自然风光，山川湖海', style: 'nature', intensity: 80 } },
    { id: 'city', name: '城市街景', description: '现代都市背景', params: { background: '现代城市街景，高楼大厦', style: 'city', intensity: 75 } },
    { id: 'studio', name: '摄影棚', description: '专业摄影背景', params: { background: '专业摄影棚，纯色背景', style: 'studio', intensity: 85 } },
    { id: 'fantasy', name: '梦幻场景', description: '奇幻背景', params: { background: '梦幻奇幻场景', style: 'fantasy', intensity: 90 } }
  ],
  params: [
    { id: 'background', name: '背景描述', type: 'text', default: '美丽的自然风光', placeholder: '描述想要的背景...' },
    { id: 'style', name: '风格', type: 'select', default: 'nature', options: [
      { value: 'nature', label: '自然' },
      { value: 'city', label: '城市' },
      { value: 'studio', label: '摄影棚' },
      { value: 'fantasy', label: '梦幻' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
EOFILE

# 2. sketch-to-photo - 添加 prompt 参数
cat > sketch-to-photo.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const sketchToPhotoConfig: ToolConfig = {
  id: 'sketch-to-photo',
  presets: [
    { id: 'realistic', name: '写实风格', description: '真实照片效果', params: { prompt: '真实照片，高清细节', style: 'realistic', intensity: 85 } },
    { id: 'artistic', name: '艺术风格', description: '艺术化处理', params: { prompt: '艺术照片，创意风格', style: 'artistic', intensity: 75 } },
    { id: 'portrait', name: '人像风格', description: '人物肖像', params: { prompt: '人物肖像，专业摄影', style: 'portrait', intensity: 80 } }
  ],
  params: [
    { id: 'prompt', name: '描述', type: 'text', default: '真实照片，高清细节', placeholder: '描述想要的效果...' },
    { id: 'style', name: '风格', type: 'select', default: 'realistic', options: [
      { value: 'realistic', label: '写实' },
      { value: 'artistic', label: '艺术' },
      { value: 'portrait', label: '人像' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
EOFILE

# 3. meme - 添加 text 参数
cat > meme.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const memeConfig: ToolConfig = {
  id: 'meme',
  presets: [
    { id: 'funny', name: '搞笑风格', description: '幽默表情包', params: { text: '哈哈哈', style: 'funny', intensity: 80 } },
    { id: 'sarcastic', name: '讽刺风格', description: '讽刺表情包', params: { text: '呵呵', style: 'sarcastic', intensity: 75 } },
    { id: 'cute', name: '可爱风格', description: '萌系表情包', params: { text: '么么哒', style: 'cute', intensity: 85 } }
  ],
  params: [
    { id: 'text', name: '文字内容', type: 'text', default: '哈哈哈', placeholder: '输入表情包文字...' },
    { id: 'style', name: '风格', type: 'select', default: 'funny', options: [
      { value: 'funny', label: '搞笑' },
      { value: 'sarcastic', label: '讽刺' },
      { value: 'cute', label: '可爱' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
EOFILE

echo "已修复 3 个配置文件"
