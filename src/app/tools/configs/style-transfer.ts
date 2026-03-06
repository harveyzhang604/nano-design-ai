import { ToolConfig } from '../types';

export const styleTransferConfig: ToolConfig = {
  id: 'style-transfer',
  presets: [
    {
      id: 'oil-painting',
      name: '油画风格',
      description: '经典油画质感，适合艺术创作',
      params: { 
        style: 'oil-painting',
        intensity: 70
      }
    },
    {
      id: 'watercolor',
      name: '水彩画',
      description: '清新水彩效果，适合风景、人像',
      params: { 
        style: 'watercolor',
        intensity: 65
      }
    },
    {
      id: 'anime',
      name: '动漫风格',
      description: '日系动漫效果，适合人像转换',
      params: { 
        style: 'anime',
        intensity: 80
      }
    },
    {
      id: 'sketch',
      name: '素描风格',
      description: '铅笔素描效果，适合艺术创作',
      params: { 
        style: 'sketch',
        intensity: 75
      }
    },
    {
      id: 'pop-art',
      name: '波普艺术',
      description: '波普艺术风格，适合创意设计',
      params: { 
        style: 'pop-art',
        intensity: 85
      }
    }
  ],
  params: [
    {
      id: 'style',
      name: '艺术风格',
      type: 'select',
      default: 'oil-painting',
      options: [
        { value: 'oil-painting', label: '油画' },
        { value: 'watercolor', label: '水彩' },
        { value: 'anime', label: '动漫' },
        { value: 'sketch', label: '素描' },
        { value: 'pop-art', label: '波普' }
      ]
    },
    {
      id: 'intensity',
      name: '风格强度',
      type: 'slider',
      default: 70,
      min: 0,
      max: 100
    }
  ]
};
