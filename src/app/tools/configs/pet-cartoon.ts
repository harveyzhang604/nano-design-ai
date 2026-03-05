import { ToolConfig } from '../types';

export const petCartoonConfig: ToolConfig = {
  id: 'pet-cartoon',
  presets: [
    {
      id: 'cute',
      name: '可爱风格',
      description: '萌萌哒卡通',
      params: { style: 'cute' }
    },
    {
      id: 'realistic',
      name: '写实风格',
      description: '保留真实感',
      params: { style: 'realistic' }
    },
    {
      id: 'anime',
      name: '动漫风格',
      description: '二次元宠物',
      params: { style: 'anime' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '卡通风格',
      type: 'select',
      default: 'cute',
      options: [
        { value: 'cute', label: '可爱' },
        { value: 'realistic', label: '写实' },
        { value: 'anime', label: '动漫' },
        { value: 'pixar', label: '皮克斯' }
      ]
    }
  ]
};
