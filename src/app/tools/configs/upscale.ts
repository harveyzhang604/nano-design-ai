import { ToolConfig } from '../types';

export const upscaleConfig: ToolConfig = {
  id: 'upscale',
  presets: [
    {
      id: 'portrait',
      name: '人像照片',
      description: '优化人脸细节，保留皮肤质感，适合自拍、合影',
      params: { 
        scale: 4,
        scene: 'portrait',
        quality: 'high',
        denoise: true,
        sharpen: 30
      }
    },
    {
      id: 'landscape',
      name: '风景照片',
      description: '增强细节，色彩鲜艳，适合旅游照、自然风光',
      params: { 
        scale: 4,
        scene: 'landscape',
        quality: 'high',
        denoise: true,
        sharpen: 50
      }
    },
    {
      id: 'text',
      name: '文字文档',
      description: '极致锐化，无细节生成，适合扫描件、截图',
      params: { 
        scale: 4,
        scene: 'text',
        quality: 'ultra',
        denoise: false,
        sharpen: 80
      }
    },
    {
      id: 'print',
      name: '打印输出',
      description: '超高质量，适合印刷、海报、展板',
      params: { 
        scale: 8,
        scene: 'photo',
        quality: 'ultra',
        denoise: true,
        sharpen: 40
      }
    },
    {
      id: 'quick',
      name: '快速放大',
      description: '2倍放大，速度快，适合网页使用',
      params: { 
        scale: 2,
        scene: 'auto',
        quality: 'medium',
        denoise: true,
        sharpen: 20
      }
    }
  ],
  params: [
    {
      id: 'scale',
      name: '放大倍数',
      type: 'select',
      default: 4,
      options: [
        { value: 2, label: '2倍（快速）' },
        { value: 4, label: '4倍（推荐）' },
        { value: 8, label: '8倍（高质量）' },
        { value: 16, label: '16倍（极致）' }
      ]
    },
    {
      id: 'scene',
      name: '场景类型',
      type: 'select',
      default: 'auto',
      options: [
        { value: 'auto', label: '自动识别' },
        { value: 'portrait', label: '人像' },
        { value: 'landscape', label: '风景' },
        { value: 'text', label: '文字' },
        { value: 'photo', label: '照片' },
        { value: 'anime', label: '动漫' }
      ]
    },
    {
      id: 'quality',
      name: '画质',
      type: 'select',
      default: 'high',
      options: [
        { value: 'ultra', label: '极致（慢）' },
        { value: 'high', label: '高质量' },
        { value: 'medium', label: '标准' },
        { value: 'fast', label: '快速' }
      ]
    },
    {
      id: 'denoise',
      name: '降噪',
      type: 'toggle',
      default: true
    },
    {
      id: 'sharpen',
      name: '锐化强度',
      type: 'slider',
      default: 40,
      min: 0,
      max: 100
    }
  ]
};
