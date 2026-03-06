import { ToolConfig } from '../types';

export const greetingCardConfig: ToolConfig = {
  id: 'greeting-card',
  presets: [
    { id: 'birthday', name: '生日贺卡', description: '生日祝福主题', params: { style: 'birthday', intensity: 80 } },
    { id: 'holiday', name: '节日贺卡', description: '节日庆祝主题', params: { style: 'holiday', intensity: 75 } },
    { id: 'wedding', name: '婚礼贺卡', description: '婚礼祝福主题', params: { style: 'wedding', intensity: 85 } },
    { id: 'thank-you', name: '感谢卡', description: '感谢祝福主题', params: { style: 'thank-you', intensity: 70 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'birthday', options: [
      { value: 'birthday', label: '生日' },
      { value: 'holiday', label: '节日' },
      { value: 'wedding', label: '婚礼' },
      { value: 'thank-you', label: '感谢' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
