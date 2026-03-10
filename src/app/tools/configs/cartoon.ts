import { ToolConfig } from '../types';

export const cartoonConfig: ToolConfig = {
  id: 'cartoon',
  presets: [
    { id: 'cute', name: '可爱卡通', description: '萌系可爱风格', params: { style: 'cute', intensity: 80 } },
    { id: 'anime', name: '动漫风格', description: '日系动漫效果', params: { style: 'anime', intensity: 85 } },
    { id: '3d', name: '3D卡通', description: '3D卡通效果', params: { style: '3d', intensity: 75 } },
    { id: 'chatgpt', name: 'ChatGPT 风格 🤖', description: 'ChatGPT 官方头像风格', params: { style: 'chatgpt', intensity: 85 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'cute', options: [
      { value: 'cute', label: '可爱' },
      { value: 'anime', label: '动漫' },
      { value: '3d', label: '3D' },
      { value: 'chatgpt', label: 'ChatGPT 风格 🤖' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
