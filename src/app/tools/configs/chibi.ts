import { ToolConfig } from '../types';

export const chibiConfig: ToolConfig = {
  id: 'chibi',
  presets: [
    { 
      id: 'cute', 
      name: '超萌 Chibi 🥺', 
      description: '大头小身，超级可爱', 
      params: { style: 'cute', headSize: 90, profession: 'none' } 
    },
    { 
      id: 'kawaii', 
      name: 'Kawaii 风格 ✨', 
      description: '日系可爱风格', 
      params: { style: 'kawaii', headSize: 85, profession: 'none' } 
    },
    { 
      id: 'doctor', 
      name: 'Q版医生 👨‍⚕️', 
      description: '超萌医生装', 
      params: { style: 'cute', headSize: 90, profession: 'doctor' } 
    },
    { 
      id: 'programmer', 
      name: 'Q版程序员 👨‍💻', 
      description: '超萌程序员装', 
      params: { style: 'cute', headSize: 90, profession: 'programmer' } 
    },
    { 
      id: 'chef', 
      name: 'Q版厨师 👨‍🍳', 
      description: '超萌厨师装', 
      params: { style: 'cute', headSize: 90, profession: 'chef' } 
    },
    { 
      id: 'astronaut', 
      name: 'Q版宇航员 👨‍🚀', 
      description: '超萌宇航服', 
      params: { style: 'cute', headSize: 90, profession: 'astronaut' } 
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
    },
    {
      id: 'profession',
      name: '职业装',
      type: 'select',
      default: 'none',
      options: [
        { value: 'none', label: '无职业装' },
        { value: 'doctor', label: '医生 👨‍⚕️' },
        { value: 'nurse', label: '护士 👩‍⚕️' },
        { value: 'programmer', label: '程序员 👨‍💻' },
        { value: 'chef', label: '厨师 👨‍🍳' },
        { value: 'teacher', label: '教师 👨‍🏫' },
        { value: 'astronaut', label: '宇航员 👨‍🚀' },
        { value: 'police', label: '警察 👮' },
        { value: 'firefighter', label: '消防员 👨‍🚒' },
        { value: 'pilot', label: '飞行员 👨‍✈️' },
        { value: 'scientist', label: '科学家 👨‍🔬' },
        { value: 'artist', label: '艺术家 👨‍🎨' },
        { value: 'musician', label: '音乐家 👨‍🎤' }
      ]
    }
  ]
};
