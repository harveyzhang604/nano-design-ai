import { ToolConfig } from '../types';

export const upscaleConfig: ToolConfig = {
  id: 'upscale',
  presets: [
    {
      id: 'standard',
      name: '标准放大',
      description: '2倍放大，平衡质量和速度',
      params: { scale: 2, quality: 'standard' }
    },
    {
      id: 'high',
      name: '高质量',
      description: '4倍放大，最佳画质',
      params: { scale: 4, quality: 'high' }
    },
    {
      id: 'ultra',
      name: '超高清',
      description: '8倍放大，极致细节',
      params: { scale: 8, quality: 'ultra' }
    }
  ],
  params: [
    {
      id: 'scale',
      name: '放大倍数',
      type: 'select',
      default: 2,
      options: [
        { value: 2, label: '2倍' },
        { value: 4, label: '4倍' },
        { value: 8, label: '8倍' }
      ]
    },
    {
      id: 'quality',
      name: '画质',
      type: 'select',
      default: 'standard',
      options: [
        { value: 'standard', label: '标准' },
        { value: 'high', label: '高质量' },
        { value: 'ultra', label: '超高清' }
      ]
    }
  ]
};
