import { ToolConfig } from '../types';

export const eraseConfig: ToolConfig = {
  id: 'erase',
  presets: [
    {
      id: 'quick',
      name: '快速去除',
      description: '速度优先，适合简单背景',
      params: { 
        quality: 'fast',
        edgeBlend: 50
      }
    },
    {
      id: 'precise',
      name: '精准去除',
      description: '质量优先，适合复杂背景',
      params: { 
        quality: 'high',
        edgeBlend: 80
      }
    },
    {
      id: 'smart',
      name: '智能填充',
      description: 'AI自动填充，适合大面积去除',
      params: { 
        quality: 'smart',
        edgeBlend: 70
      }
    },
    {
      id: 'watermark',
      name: '去水印',
      description: '专用于去除水印、文字',
      params: { 
        quality: 'high',
        edgeBlend: 90
      }
    }
  ],
  params: [
    {
      id: 'targetDescription',
      name: '要删除的内容',
      type: 'text',
      default: '',
      placeholder: '例如：删除照片中的路人、去掉水印、移除左边的垃圾桶'
    },
    {
      id: 'quality',
      name: '处理质量',
      type: 'select',
      default: 'high',
      options: [
        { value: 'fast', label: '快速' },
        { value: 'high', label: '高质量' },
        { value: 'smart', label: '智能' }
      ]
    },
    {
      id: 'edgeBlend',
      name: '边缘融合',
      type: 'slider',
      default: 70,
      min: 0,
      max: 100
    }
  ]
};
