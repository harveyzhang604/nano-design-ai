import { ToolConfig } from '../types';

export const tattooConfig: ToolConfig = {
  id: 'tattoo',
  presets: [
    { id: 'traditional', name: '传统纹身', description: '经典传统风格', params: { style: 'traditional', intensity: 75 } },
    { id: 'modern', name: '现代纹身', description: '现代时尚风格', params: { style: 'modern', intensity: 80 } },
    { id: 'minimal', name: '极简纹身', description: '简约线条风格', params: { style: 'minimal', intensity: 70 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'modern', options: [
      { value: 'traditional', label: '传统' },
      { value: 'modern', label: '现代' },
      { value: 'minimal', label: '极简' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
