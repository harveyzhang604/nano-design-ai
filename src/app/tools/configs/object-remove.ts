import { ToolConfig } from '../types';

export const objectRemoveConfig: ToolConfig = {
  id: 'object-remove',
  presets: [
    { id: 'auto', name: '智能识别', description: 'AI自动识别并移除', params: { mode: 'auto', feather: 5 } },
    { id: 'precise', name: '精确移除', description: '精确边缘处理', params: { mode: 'precise', feather: 2 } },
    { id: 'natural', name: '自然填充', description: '自然背景填充', params: { mode: 'natural', feather: 8 } }
  ],
  params: [
    { 
      id: 'mode', 
      name: '移除模式', 
      type: 'select', 
      default: 'auto', 
      options: [
        { value: 'auto', label: '智能识别' },
        { value: 'precise', label: '精确移除' },
        { value: 'natural', label: '自然填充' }
      ]
    },
    { id: 'feather', name: '边缘羽化', type: 'slider', default: 5, min: 0, max: 20 },
    { id: 'fillQuality', name: '填充质量', type: 'slider', default: 80, min: 50, max: 100 }
  ]
};
