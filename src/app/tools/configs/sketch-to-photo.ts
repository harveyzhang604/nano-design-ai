import { ToolConfig } from '../types';

export const sketchToPhotoConfig: ToolConfig = {
  id: 'sketch-to-photo',
  presets: [
    { id: 'realistic', name: '写实风格', description: '真实照片效果', params: { prompt: '真实照片，高清细节', style: 'realistic', intensity: 85 } },
    { id: 'artistic', name: '艺术风格', description: '艺术化处理', params: { prompt: '艺术照片，创意风格', style: 'artistic', intensity: 75 } },
    { id: 'portrait', name: '人像风格', description: '人物肖像', params: { prompt: '人物肖像，专业摄影', style: 'portrait', intensity: 80 } }
  ],
  params: [
    { id: 'prompt', name: '描述', type: 'text', default: '真实照片，高清细节', placeholder: '描述想要的效果...' },
    { id: 'style', name: '风格', type: 'select', default: 'realistic', options: [
      { value: 'realistic', label: '写实' },
      { value: 'artistic', label: '艺术' },
      { value: 'portrait', label: '人像' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
