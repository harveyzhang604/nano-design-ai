import { ToolConfig } from '../types';

export const chibiConfig: ToolConfig = {
  id: 'chibi',
  presets: [
    { 
      id: 'cute', 
      name: '超萌 Chibi 🥺', 
      description: '大头小身，超级可爱', 
      params: { style: 'cute', headSize: 90 } 
    },
    { 
      id: 'kawaii', 
      name: 'Kawaii 风格 ✨', 
      description: '日系可爱风格', 
      params: { style: 'kawaii', headSize: 85 } 
    },
    { 
      id: 'sd', 
      name: 'SD 娃娃 🎀', 
      description: 'Super Deformed 风格', 
      params: { style: 'sd', headSize: 95 } 
    },
    { 
      id: 'anime-chibi', 
      name: '动漫 Chibi 🌸', 
      description: '动漫风格的 Q 版', 
      params: { style: 'anime-chibi', headSize: 88 } 
    }
  ],
  params: [
    { 
      id: 'style', 
      name: 'Chibi 风格', 
      type: 'select', 
      default: 'cute', 
      options: [
        { value: 'cute', label: '超萌 Chibi 🥺' },
        { value: 'kawaii', label: 'Kawaii 风格 ✨' },
        { value: 'sd', label: 'SD 娃娃 🎀' },
        { value: 'anime-chibi', label: '动漫 Chibi 🌸' }
      ]
    },
    { 
      id: 'headSize', 
      name: '头身比例', 
      type: 'slider', 
      default: 90, 
      min: 70, 
      max: 100,
      description: '头部相对身体的大小（越大越 Q）'
    },
    {
      id: 'eyeSize',
      name: '眼睛大小',
      type: 'slider',
      default: 85,
      min: 60,
      max: 100,
      description: '眼睛的夸张程度'
    },
    {
      id: 'background',
      name: '背景',
      type: 'select',
      default: 'pastel',
      options: [
        { value: 'pastel', label: '马卡龙色背景' },
        { value: 'sparkle', label: '闪亮星星背景' },
        { value: 'simple', label: '简洁纯色' },
        { value: 'transparent', label: '透明背景' }
      ]
    }
  ]
};
