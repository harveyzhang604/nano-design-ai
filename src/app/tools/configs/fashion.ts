import { ToolConfig } from '../types';

export const fashionConfig: ToolConfig = {
  id: 'fashion',
  presets: [
    { id: 'casual', name: '休闲时尚', description: '日常休闲风格', params: { style: 'casual', intensity: 70 } },
    { id: 'formal', name: '正装时尚', description: '商务正装风格', params: { style: 'formal', intensity: 80 } },
    { id: 'trendy', name: '潮流时尚', description: '潮流前沿风格', params: { style: 'trendy', intensity: 85 } },
    { id: 'elegant', name: '优雅时尚', description: '优雅高贵风格', params: { style: 'elegant', intensity: 90 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'casual', options: [
      { value: 'casual', label: '休闲' },
      { value: 'formal', label: '正装' },
      { value: 'trendy', label: '潮流' },
      { value: 'elegant', label: '优雅' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
