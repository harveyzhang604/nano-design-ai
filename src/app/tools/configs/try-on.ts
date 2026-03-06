import { ToolConfig } from '../types';

export const tryOnConfig: ToolConfig = {
  id: 'try-on',
  presets: [
    { id: 'realistic', name: '真实试穿', description: '真实试穿效果', params: { style: 'realistic', intensity: 85 } },
    { id: 'fashion', name: '时尚展示', description: '时尚展示效果', params: { style: 'fashion', intensity: 80 } },
    { id: 'casual', name: '休闲试穿', description: '休闲试穿效果', params: { style: 'casual', intensity: 75 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'realistic', options: [
      { value: 'realistic', label: '真实' },
      { value: 'fashion', label: '时尚' },
      { value: 'casual', label: '休闲' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
