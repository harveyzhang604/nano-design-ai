import { ToolConfig } from '../types';

export const sketchToImageConfig: ToolConfig = {
  id: 'sketch-to-image',
  presets: [
    {
      id: 'realistic',
      name: '写实风格',
      description: '真实照片效果',
      params: { style: 'realistic' }
    },
    {
      id: 'artistic',
      name: '艺术风格',
      description: '艺术化处理',
      params: { style: 'artistic' }
    },
    {
      id: 'anime',
      name: '动漫风格',
      description: '二次元效果',
      params: { style: 'anime' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '转换风格',
      type: 'select',
      default: 'realistic',
      options: [
        { value: 'realistic', label: '写实' },
        { value: 'artistic', label: '艺术' },
        { value: 'anime', label: '动漫' }
      ]
    }
  ]
};
