import { ToolConfig } from '../types';

export const faceSwapConfig: ToolConfig = {
  id: 'face-swap',
  presets: [
    { id: 'natural', name: '自然融合', description: '自然换脸效果', params: { style: 'natural', intensity: 80 } },
    { id: 'precise', name: '精准换脸', description: '精准面部匹配', params: { style: 'precise', intensity: 90 } },
    { id: 'artistic', name: '艺术风格', description: '艺术化处理', params: { style: 'artistic', intensity: 75 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' },
      { value: 'precise', label: '精准' },
      { value: 'artistic', label: '艺术' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
