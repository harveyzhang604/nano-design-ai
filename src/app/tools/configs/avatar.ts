import { ToolConfig } from '../types';

export const avatarConfig: ToolConfig = {
  id: 'avatar',
  presets: [
    {
      id: 'anime',
      name: '动漫风格',
      description: '二次元头像',
      params: { style: 'anime' }
    },
    {
      id: 'realistic',
      name: '写实风格',
      description: '真实感头像',
      params: { style: 'realistic' }
    },
    {
      id: 'cartoon',
      name: '卡通风格',
      description: '可爱卡通',
      params: { style: 'cartoon' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '头像风格',
      type: 'select',
      default: 'anime',
      options: [
        { value: 'anime', label: '动漫' },
        { value: 'realistic', label: '写实' },
        { value: 'cartoon', label: '卡通' },
        { value: 'pixel', label: '像素' }
      ]
    }
  ]
};
