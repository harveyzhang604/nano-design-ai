import { ToolConfig } from '../types';

export const portraitConfig: ToolConfig = {
  id: 'portrait',
  presets: [
    {
      id: 'natural',
      name: '自然',
      description: '轻微美化，保持真实',
      params: { beautyLevel: 'natural' }
    },
    {
      id: 'fresh',
      name: '清新',
      description: '适度美化，清新自然',
      params: { beautyLevel: 'fresh' }
    },
    {
      id: 'professional',
      name: '专业',
      description: '明显美化，专业效果',
      params: { beautyLevel: 'professional' }
    }
  ],
  params: [
    {
      id: 'beautyLevel',
      name: '美颜程度',
      type: 'select',
      default: 'fresh',
      options: [
        { value: 'natural', label: '自然' },
        { value: 'fresh', label: '清新' },
        { value: 'professional', label: '专业' }
      ]
    }
  ]
};
