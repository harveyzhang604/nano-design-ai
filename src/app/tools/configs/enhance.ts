import { ToolConfig } from '../types';

export const enhanceConfig: ToolConfig = {
  id: 'enhance',
  presets: [
    {
      id: 'natural',
      name: '自然增强',
      description: '轻微提升画质，几乎看不出处理痕迹',
      params: { beautyLevel: 'subtle' }
    },
    {
      id: 'light',
      name: '轻度美化',
      description: '适度美化，保持自然',
      params: { beautyLevel: 'light' }
    },
    {
      id: 'professional',
      name: '专业美颜',
      description: '明显美化效果，适合社交媒体',
      params: { beautyLevel: 'professional' }
    }
  ],
  params: [
    {
      id: 'beautyLevel',
      name: '美化程度',
      type: 'select',
      default: 'subtle',
      options: [
        { value: 'subtle', label: '自然' },
        { value: 'light', label: '轻度' },
        { value: 'professional', label: '专业' }
      ]
    }
  ]
};
