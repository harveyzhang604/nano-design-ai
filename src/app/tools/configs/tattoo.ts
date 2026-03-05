import { ToolConfig } from '../types';

export const tattooConfig: ToolConfig = {
  id: 'tattoo',
  presets: [
    {
      id: 'traditional',
      name: '传统纹身',
      description: '经典纹身风格',
      params: { style: 'traditional', placement: 'arm' }
    },
    {
      id: 'watercolor',
      name: '水彩纹身',
      description: '艺术水彩效果',
      params: { style: 'watercolor', placement: 'arm' }
    },
    {
      id: 'minimalist',
      name: '极简纹身',
      description: '简约线条',
      params: { style: 'minimalist', placement: 'arm' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '纹身风格',
      type: 'select',
      default: 'traditional',
      options: [
        { value: 'traditional', label: '传统' },
        { value: 'watercolor', label: '水彩' },
        { value: 'minimalist', label: '极简' },
        { value: 'tribal', label: '部落' }
      ]
    },
    {
      id: 'placement',
      name: '位置',
      type: 'select',
      default: 'arm',
      options: [
        { value: 'arm', label: '手臂' },
        { value: 'back', label: '背部' },
        { value: 'chest', label: '胸部' },
        { value: 'leg', label: '腿部' }
      ]
    }
  ]
};
