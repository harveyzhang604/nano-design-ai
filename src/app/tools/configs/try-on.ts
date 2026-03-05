import { ToolConfig } from '../types';

export const tryOnConfig: ToolConfig = {
  id: 'try-on',
  presets: [
    {
      id: 'casual',
      name: '休闲装',
      description: '日常休闲风格',
      params: { category: 'casual' }
    },
    {
      id: 'formal',
      name: '正装',
      description: '商务正式',
      params: { category: 'formal' }
    },
    {
      id: 'sport',
      name: '运动装',
      description: '运动休闲',
      params: { category: 'sport' }
    }
  ],
  params: [
    {
      id: 'category',
      name: '服装类型',
      type: 'select',
      default: 'casual',
      options: [
        { value: 'casual', label: '休闲' },
        { value: 'formal', label: '正装' },
        { value: 'sport', label: '运动' },
        { value: 'fashion', label: '时尚' }
      ]
    }
  ]
};
