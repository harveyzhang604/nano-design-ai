import { ToolConfig } from '../types';

export const hairstyleConfig: ToolConfig = {
  id: 'hairstyle',
  presets: [
    { id: 'natural', name: '自然风格', description: '自然发型效果', params: { style: 'natural', intensity: 70 } },
    { id: 'trendy', name: '时尚潮流', description: '潮流发型设计', params: { style: 'trendy', intensity: 80 } },
    { id: 'classic', name: '经典风格', description: '经典发型设计', params: { style: 'classic', intensity: 75 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' },
      { value: 'trendy', label: '潮流' },
      { value: 'classic', label: '经典' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
