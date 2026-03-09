import { ToolConfig } from '../types';

export const greetingConfig: ToolConfig = {
  id: 'greeting',
  presets: [
    { id: 'birthday', name: '生日祝福', description: '生日贺卡主题', params: { style: 'birthday', intensity: 80 } },
    { id: 'holiday', name: '节日祝福', description: '节日贺卡主题', params: { style: 'holiday', intensity: 75 } },
    { id: 'wedding', name: '婚礼祝福', description: '婚礼贺卡主题', params: { style: 'wedding', intensity: 85 } },
    { id: 'thank-you', name: '感谢祝福', description: '感谢卡主题', params: { style: 'thank-you', intensity: 70 } }
  ],
  params: [
    { id: 'message', name: '祝福语', type: 'text', default: '生日快乐！', placeholder: '输入祝福语...' },
    { id: 'style', name: '风格', type: 'select', default: 'birthday', options: [
      { value: 'birthday', label: '生日' },
      { value: 'holiday', label: '节日' },
      { value: 'wedding', label: '婚礼' },
      { value: 'thank-you', label: '感谢' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
