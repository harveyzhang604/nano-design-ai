import { ToolConfig } from '../types';

export const portraitConfig: ToolConfig = {
  id: 'portrait',
  presets: [
    {
      id: 'minimal',
      name: '最小处理',
      description: '只去瑕疵，保留真实感',
      params: { 
        level: 'minimal',
        skinSmooth: 20,
        brighten: 10,
        eyeEnhance: 20,
        faceSlim: 0
      }
    },
    {
      id: 'natural',
      name: '自然美颜',
      description: '轻度美化，保留自然感，适合日常自拍',
      params: { 
        level: 'natural',
        skinSmooth: 40,
        brighten: 30,
        eyeEnhance: 40,
        faceSlim: 20
      }
    },
    {
      id: 'professional',
      name: '专业修图',
      description: '标准美化，适合商务照、证件照',
      params: { 
        level: 'professional',
        skinSmooth: 60,
        brighten: 50,
        eyeEnhance: 60,
        faceSlim: 30
      }
    },
    {
      id: 'glamour',
      name: '魅力增强',
      description: '明显美化，适合时尚杂志风格',
      params: { 
        level: 'glamour',
        skinSmooth: 80,
        brighten: 70,
        eyeEnhance: 80,
        faceSlim: 50
      }
    },
    {
      id: 'wedding',
      name: '婚纱照',
      description: '完美呈现，适合婚纱照、写真',
      params: { 
        level: 'wedding',
        skinSmooth: 70,
        brighten: 60,
        eyeEnhance: 70,
        faceSlim: 40
      }
    }
  ],
  params: [
    {
      id: 'level',
      name: '美颜程度',
      type: 'select',
      default: 'natural',
      options: [
        { value: 'minimal', label: '最小' },
        { value: 'natural', label: '自然' },
        { value: 'professional', label: '专业' },
        { value: 'glamour', label: '魅力' },
        { value: 'wedding', label: '婚纱' }
      ]
    },
    {
      id: 'skinSmooth',
      name: '磨皮',
      type: 'slider',
      default: 40,
      min: 0,
      max: 100
    },
    {
      id: 'brighten',
      name: '美白',
      type: 'slider',
      default: 30,
      min: 0,
      max: 100
    },
    {
      id: 'eyeEnhance',
      name: '眼睛增强',
      type: 'slider',
      default: 40,
      min: 0,
      max: 100
    },
    {
      id: 'faceSlim',
      name: '瘦脸',
      type: 'slider',
      default: 20,
      min: 0,
      max: 100
    }
  ]
};
