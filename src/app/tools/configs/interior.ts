import { ToolConfig } from '../types';

export const interiorConfig: ToolConfig = {
  id: 'interior',
  presets: [
    { id: 'modern', name: '现代简约', description: '简洁现代风格', params: { style: 'modern', intensity: 75 } },
    { id: 'classic', name: '经典欧式', description: '欧式古典风格', params: { style: 'classic', intensity: 80 } },
    { id: 'minimal', name: '极简主义', description: '极简设计风格', params: { style: 'minimal', intensity: 70 } },
    { id: 'cozy', name: '温馨舒适', description: '温暖舒适风格', params: { style: 'cozy', intensity: 75 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'modern', options: [
      { value: 'modern', label: '现代' },
      { value: 'classic', label: '经典' },
      { value: 'minimal', label: '极简' },
      { value: 'cozy', label: '温馨' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
