import { ToolConfig } from '../types';

export const greetingConfig: ToolConfig = {
  id: 'greeting',
  presets: [
    {
      id: 'birthday',
      name: '生日贺卡',
      description: '生日祝福',
      params: { occasion: 'birthday' }
    },
    {
      id: 'holiday',
      name: '节日贺卡',
      description: '节日祝福',
      params: { occasion: 'holiday' }
    },
    {
      id: 'celebration',
      name: '庆祝贺卡',
      description: '庆祝活动',
      params: { occasion: 'celebration' }
    }
  ],
  params: [
    {
      id: 'occasion',
      name: '场合类型',
      type: 'select',
      default: 'birthday',
      options: [
        { value: 'birthday', label: '生日' },
        { value: 'holiday', label: '节日' },
        { value: 'celebration', label: '庆祝' }
      ]
    }
  ]
};
