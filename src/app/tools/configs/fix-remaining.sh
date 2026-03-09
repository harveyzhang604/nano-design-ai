#!/bin/bash

# 4. face-swap - 添加 targetImageUrl 参数
cat > face-swap.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const faceSwapConfig: ToolConfig = {
  id: 'face-swap',
  presets: [
    { id: 'natural', name: '自然换脸', description: '自然融合', params: { targetImageUrl: '', style: 'natural', intensity: 85 } },
    { id: 'celebrity', name: '明星脸', description: '明星换脸', params: { targetImageUrl: '', style: 'celebrity', intensity: 80 } }
  ],
  params: [
    { id: 'targetImageUrl', name: '目标人脸图片URL', type: 'text', default: '', placeholder: '粘贴目标人脸图片URL...' },
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' },
      { value: 'celebrity', label: '明星' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 85, min: 0, max: 100 }
  ]
};
EOFILE

# 5. try-on - 添加 clothingImageUrl 参数
cat > try-on.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const tryOnConfig: ToolConfig = {
  id: 'try-on',
  presets: [
    { id: 'casual', name: '休闲装', description: '日常休闲', params: { clothingImageUrl: '', style: 'casual', intensity: 80 } },
    { id: 'formal', name: '正装', description: '商务正装', params: { clothingImageUrl: '', style: 'formal', intensity: 85 } },
    { id: 'sports', name: '运动装', description: '运动风格', params: { clothingImageUrl: '', style: 'sports', intensity: 75 } }
  ],
  params: [
    { id: 'clothingImageUrl', name: '服装图片URL', type: 'text', default: '', placeholder: '粘贴服装图片URL...' },
    { id: 'style', name: '风格', type: 'select', default: 'casual', options: [
      { value: 'casual', label: '休闲' },
      { value: 'formal', label: '正装' },
      { value: 'sports', label: '运动' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
EOFILE

# 6. cosplay - 添加 character 参数
cat > cosplay.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const cosplayConfig: ToolConfig = {
  id: 'cosplay',
  presets: [
    { id: 'anime', name: '动漫角色', description: '动漫Cos', params: { character: '动漫角色', style: 'anime', intensity: 85 } },
    { id: 'game', name: '游戏角色', description: '游戏Cos', params: { character: '游戏角色', style: 'game', intensity: 80 } },
    { id: 'movie', name: '电影角色', description: '电影Cos', params: { character: '电影角色', style: 'movie', intensity: 75 } }
  ],
  params: [
    { id: 'character', name: '角色名称', type: 'text', default: '动漫角色', placeholder: '输入想Cos的角色...' },
    { id: 'style', name: '风格', type: 'select', default: 'anime', options: [
      { value: 'anime', label: '动漫' },
      { value: 'game', label: '游戏' },
      { value: 'movie', label: '电影' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
EOFILE

# 7. real-estate - 添加 renovationStyle 参数
cat > real-estate.ts << 'EOFILE'
import { ToolConfig } from '../types';

export const realEstateConfig: ToolConfig = {
  id: 'real-estate',
  presets: [
    { id: 'modern', name: '现代风格', description: '现代简约', params: { renovationStyle: '现代简约风格', style: 'modern', intensity: 80 } },
    { id: 'classic', name: '古典风格', description: '欧式古典', params: { renovationStyle: '欧式古典风格', style: 'classic', intensity: 85 } },
    { id: 'minimalist', name: '极简风格', description: '北欧极简', params: { renovationStyle: '北欧极简风格', style: 'minimalist', intensity: 75 } }
  ],
  params: [
    { id: 'renovationStyle', name: '装修风格', type: 'text', default: '现代简约风格', placeholder: '描述装修风格...' },
    { id: 'style', name: '风格', type: 'select', default: 'modern', options: [
      { value: 'modern', label: '现代' },
      { value: 'classic', label: '古典' },
      { value: 'minimalist', label: '极简' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
EOFILE

echo "已修复 4 个配置文件"
