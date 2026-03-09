import { ToolConfig } from '../types';

export const fashionConfig: ToolConfig = {
  id: 'fashion',
  presets: [
    { id: 'casual', name: '休闲装', description: '日常休闲', params: { outfit: '休闲装', style: 'casual', intensity: 80 } },
    { id: 'formal', name: '正装', description: '商务正装', params: { outfit: '商务正装', style: 'formal', intensity: 85 } },
    { id: 'evening', name: '晚礼服', description: '晚宴礼服', params: { outfit: '晚礼服', style: 'evening', intensity: 90 } }
  ],
  params: [
    { id: 'outfit', name: '服装描述', type: 'text', default: '休闲装', placeholder: '描述服装风格...' },
    { id: 'style', name: '风格', type: 'select', default: 'casual', options: [
      { value: 'casual', label: '休闲' },
      { value: 'formal', label: '正装' },
      { value: 'evening', label: '晚礼服' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
