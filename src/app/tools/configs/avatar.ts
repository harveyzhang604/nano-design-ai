import { ToolConfig } from '../types';

export const avatarConfig: ToolConfig = {
  id: 'avatar',
  presets: [
    { id: 'professional', name: '职业头像', description: '商务风格，适合LinkedIn', params: { style: 'professional', intensity: 70 } },
    { id: 'casual', name: '休闲头像', description: '轻松风格，适合社交媒体', params: { style: 'casual', intensity: 65 } },
    { id: 'artistic', name: '艺术头像', description: '艺术风格，个性化', params: { style: 'artistic', intensity: 80 } },
    { id: 'anime', name: '动漫头像', description: '动漫风格，二次元', params: { style: 'anime', intensity: 85 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'professional', options: [
      { value: 'professional', label: '职业' },
      { value: 'casual', label: '休闲' },
      { value: 'artistic', label: '艺术' },
      { value: 'anime', label: '动漫' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 70, min: 0, max: 100 }
  ]
};
