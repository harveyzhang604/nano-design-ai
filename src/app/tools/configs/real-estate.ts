import { ToolConfig } from '../types';

export const realEstateConfig: ToolConfig = {
  id: 'real-estate',
  presets: [
    { id: 'modern', name: '现代风格', description: '现代家居布置', params: { style: 'modern', intensity: 80 } },
    { id: 'luxury', name: '豪华风格', description: '豪华家居布置', params: { style: 'luxury', intensity: 85 } },
    { id: 'minimal', name: '极简风格', description: '极简家居布置', params: { style: 'minimal', intensity: 75 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'modern', options: [
      { value: 'modern', label: '现代' },
      { value: 'luxury', label: '豪华' },
      { value: 'minimal', label: '极简' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
