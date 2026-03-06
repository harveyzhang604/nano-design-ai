import { ToolConfig } from '../types';

export const petCartoonConfig: ToolConfig = {
  id: 'pet-cartoon',
  presets: [
    { id: 'cute', name: '可爱卡通', description: '萌系可爱风格', params: { style: 'cute', intensity: 80 } },
    { id: 'realistic', name: '写实卡通', description: '写实卡通风格', params: { style: 'realistic', intensity: 70 } },
    { id: 'anime', name: '动漫风格', description: '日系动漫效果', params: { style: 'anime', intensity: 85 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'cute', options: [
      { value: 'cute', label: '可爱' },
      { value: 'realistic', label: '写实' },
      { value: 'anime', label: '动漫' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
