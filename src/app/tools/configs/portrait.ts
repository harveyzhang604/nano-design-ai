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
        faceSlim: 0,
        removeBlemishes: true,
        removeWrinkles: 'keep'
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
        faceSlim: 20,
        removeBlemishes: true,
        removeWrinkles: 'keep'
      },
      recommended: true
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
        faceSlim: 30,
        removeBlemishes: true,
        removeWrinkles: 'optional'
      },
      popular: true
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
        faceSlim: 50,
        removeBlemishes: true,
        removeWrinkles: 'remove'
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
        faceSlim: 40,
        removeBlemishes: true,
        removeWrinkles: 'remove'
      }
    }
  ],
  params: [
    {
      id: 'level',
      name: '美颜程度',
      type: 'select',
      default: 'natural',
      tooltip: '整体美颜强度，影响所有参数的基准值',
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
      max: 100,
      tooltip: '平滑皮肤，去除瑕疵和毛孔，保留自然纹理'
    },
    {
      id: 'brighten',
      name: '美白',
      type: 'slider',
      default: 30,
      min: 0,
      max: 100,
      tooltip: '提亮肤色，让皮肤更白皙透亮'
    },
    {
      id: 'eyeEnhance',
      name: '眼睛增强',
      type: 'slider',
      default: 40,
      min: 0,
      max: 100,
      tooltip: '增大眼睛，提亮眼神，让眼睛更有神'
    },
    {
      id: 'faceSlim',
      name: '瘦脸',
      type: 'slider',
      default: 20,
      min: 0,
      max: 100,
      tooltip: '自然瘦脸，优化脸型轮廓'
    },
    {
      id: 'removeBlemishes',
      name: '去除瑕疵',
      type: 'select',
      default: true,
      tooltip: '去除痘印、疤痕、雀斑、老年斑等面部瑕疵',
      options: [
        { value: true, label: '开启' },
        { value: false, label: '保留' }
      ]
    },
    {
      id: 'removeWrinkles',
      name: '皱纹处理',
      type: 'select',
      default: 'keep',
      tooltip: '处理面部皱纹（鱼尾纹、法令纹等）',
      options: [
        { value: 'keep', label: '保留' },
        { value: 'optional', label: '可选' },
        { value: 'remove', label: '去除' }
      ]
    }
  ],
  tips: [
    '日常自拍推荐"自然美颜"，不会过度处理',
    '证件照、商务照选择"专业修图"',
    '磨皮不要太高，保留皮肤纹理更自然',
    '瘦脸强度不要超过50，避免变形'
  ],
  examples: [
    '日常自拍：自然 + 磨皮40 + 美白30 + 眼睛40 + 瘦脸20',
    '证件照：专业 + 磨皮60 + 美白50 + 眼睛60 + 瘦脸30',
    '婚纱照：婚纱 + 磨皮70 + 美白60 + 眼睛70 + 瘦脸40'
  ]
};
