import { ToolConfig } from '../types';

export const tryOnConfig: ToolConfig = {
  id: 'try-on',
  presets: [
    { id: 'casual', name: '休闲装', description: '日常休闲', params: { clothingImageUrl: '', style: 'casual', intensity: 80 } },
    { id: 'formal', name: '正装', description: '商务正装', params: { clothingImageUrl: '', style: 'formal', intensity: 85 } },
    { id: 'sports', name: '运动装', description: '运动风格', params: { clothingImageUrl: '', style: 'sports', intensity: 75 } }
  ],
  params: [
    { id: 'clothingImageUrl', name: '服装图片URL', type: 'text', default: '', placeholder: '粘贴服装图片URL...' },
    { id: 'style', name: '风格', type: 'select', default: 'casual', options: [
      { value: 'casual', label: '休闲' },
      { value: 'formal', label: '正装' },
      { value: 'sports', label: '运动' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
