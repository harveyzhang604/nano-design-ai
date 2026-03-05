import { ToolConfig } from '../types';

export const faceSwapConfig: ToolConfig = {
  id: 'face-swap',
  presets: [
    {
      id: 'natural',
      name: '自然融合',
      description: '自然真实效果',
      params: { blend: 'natural' }
    },
    {
      id: 'precise',
      name: '精准替换',
      description: '保留原始特征',
      params: { blend: 'precise' }
    },
    {
      id: 'smooth',
      name: '平滑过渡',
      description: '柔和融合',
      params: { blend: 'smooth' }
    }
  ],
  params: [
    {
      id: 'blend',
      name: '融合模式',
      type: 'select',
      default: 'natural',
      options: [
        { value: 'natural', label: '自然' },
        { value: 'precise', label: '精准' },
        { value: 'smooth', label: '平滑' }
      ]
    }
  ]
};
