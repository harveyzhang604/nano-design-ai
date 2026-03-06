import { ToolConfig } from '../types';

export const enhanceConfig: ToolConfig = {
  id: 'enhance',
  presets: [
    {
      id: 'smart',
      name: '智能增强',
      description: 'AI自动优化，适合大部分照片',
      params: { 
        mode: 'smart',
        strength: 70,
        denoise: true
      }
    },
    {
      id: 'portrait',
      name: '人像优化',
      description: '优化肤色和细节，适合人像照片',
      params: { 
        mode: 'portrait',
        strength: 60,
        denoise: true
      }
    },
    {
      id: 'landscape',
      name: '风景优化',
      description: '增强色彩和对比度，适合风景照',
      params: { 
        mode: 'landscape',
        strength: 80,
        denoise: true
      }
    },
    {
      id: 'product',
      name: '产品优化',
      description: '锐化细节，适合产品摄影',
      params: { 
        mode: 'product',
        strength: 75,
        denoise: false
      }
    },
    {
      id: 'night',
      name: '夜景增强',
      description: '提亮暗部，降噪，适合夜景照片',
      params: { 
        mode: 'night',
        strength: 85,
        denoise: true
      }
    }
  ],
  params: [
    {
      id: 'mode',
      name: '优化模式',
      type: 'select',
      default: 'smart',
      options: [
        { value: 'smart', label: '智能' },
        { value: 'portrait', label: '人像' },
        { value: 'landscape', label: '风景' },
        { value: 'product', label: '产品' },
        { value: 'night', label: '夜景' }
      ]
    },
    {
      id: 'strength',
      name: '增强强度',
      type: 'slider',
      default: 70,
      min: 0,
      max: 100
    },
    {
      id: 'denoise',
      name: '降噪',
      type: 'toggle',
      default: true
    }
  ]
};
