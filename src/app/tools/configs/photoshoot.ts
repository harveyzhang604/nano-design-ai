import { ToolConfig } from '../types';

export const photoshootConfig: ToolConfig = {
  id: 'photoshoot',
  presets: [
    { id: 'professional', name: '专业写真', description: '专业摄影风格', params: { style: 'professional', intensity: 80 } },
    { id: 'fashion', name: '时尚大片', description: '时尚杂志风格', params: { style: 'fashion', intensity: 85 } },
    { id: 'artistic', name: '艺术写真', description: '艺术创作风格', params: { style: 'artistic', intensity: 75 } },
    { id: 'casual', name: '生活写真', description: '自然生活风格', params: { style: 'casual', intensity: 70 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'professional', options: [
      { value: 'professional', label: '专业' },
      { value: 'fashion', label: '时尚' },
      { value: 'artistic', label: '艺术' },
      { value: 'casual', label: '生活' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
