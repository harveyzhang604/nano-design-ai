import { ToolConfig } from '../types';

export const genderSwapConfig: ToolConfig = {
  id: 'gender-swap',
  presets: [
    { id: 'natural', name: '自然风格', description: '自然性别转换', params: { style: 'natural', intensity: 75 } },
    { id: 'enhanced', name: '增强效果', description: '明显性别特征', params: { style: 'enhanced', intensity: 85 } },
    { id: 'artistic', name: '艺术风格', description: '艺术化处理', params: { style: 'artistic', intensity: 70 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' },
      { value: 'enhanced', label: '增强' },
      { value: 'artistic', label: '艺术' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
