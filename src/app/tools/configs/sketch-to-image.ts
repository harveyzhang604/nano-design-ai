import { ToolConfig } from '../types';

export const sketchToImageConfig: ToolConfig = {
  id: 'sketch-to-image',
  presets: [
    { id: 'realistic', name: '真实照片', description: '逼真照片效果', params: { style: 'realistic', intensity: 80 } },
    { id: 'artistic', name: '艺术风格', description: '艺术化处理', params: { style: 'artistic', intensity: 70 } },
    { id: 'anime', name: '动漫风格', description: '日系动漫效果', params: { style: 'anime', intensity: 75 } },
    { id: 'cartoon', name: '卡通风格', description: '卡通化效果', params: { style: 'cartoon', intensity: 70 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'realistic', options: [
      { value: 'realistic', label: '真实' },
      { value: 'artistic', label: '艺术' },
      { value: 'anime', label: '动漫' },
      { value: 'cartoon', label: '卡通' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
