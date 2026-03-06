import { ToolConfig } from '../types';

export const sketchToPhotoConfig: ToolConfig = {
  id: 'sketch-to-photo',
  presets: [
    { id: 'realistic', name: '真实照片', description: '逼真照片效果', params: { style: 'realistic', intensity: 80 } },
    { id: 'artistic', name: '艺术风格', description: '艺术化处理', params: { style: 'artistic', intensity: 70 } },
    { id: 'enhanced', name: '增强效果', description: '增强细节效果', params: { style: 'enhanced', intensity: 85 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'realistic', options: [
      { value: 'realistic', label: '真实' },
      { value: 'artistic', label: '艺术' },
      { value: 'enhanced', label: '增强' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
