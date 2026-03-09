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
