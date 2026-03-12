import { ToolConfig } from '../types';

export const pseudoAnimationConfig: ToolConfig = {
  id: 'pseudo-animation',
  presets: [
    {
      id: 'subtle-motion',
      name: '微动效果',
      description: '轻微头部转动、眨眼、微笑',
      params: { 
        animationType: 'subtle-motion',
        frames: 3,
        duration: 2000
      }
    },
    {
      id: 'expression-change',
      name: '表情变化',
      description: '从平静到微笑的自然过渡',
      params: { 
        animationType: 'expression-change',
        frames: 3,
        duration: 3000
      }
    },
    {
      id: 'zoom-in',
      name: '缓慢推进',
      description: '镜头缓慢推进，增加戏剧感',
      params: { 
        animationType: 'zoom-in',
        frames: 4,
        duration: 4000
      }
    },
    {
      id: 'lighting-shift',
      name: '光影变化',
      description: '光线从左到右移动，营造氛围',
      params: { 
        animationType: 'lighting-shift',
        frames: 3,
        duration: 3000
      }
    },
    {
      id: 'smooth-5frame',
      name: '流畅5帧',
      description: '5帧微动，更流畅的循环',
      params: { 
        animationType: 'subtle-motion',
        frames: 5,
        duration: 3000
      }
    }
  ],
  params: [
    {
      id: 'animationType',
      name: '动画类型',
      type: 'select',
      default: 'subtle-motion',
      options: [
        { value: 'subtle-motion', label: '微动效果' },
        { value: 'expression-change', label: '表情变化' },
        { value: 'zoom-in', label: '缓慢推进' },
        { value: 'lighting-shift', label: '光影变化' }
      ]
    },
    {
      id: 'frames',
      name: '关键帧数',
      type: 'slider',
      default: 3,
      min: 3,
      max: 5,
      description: '3帧=快速，5帧=流畅'
    },
    {
      id: 'duration',
      name: '动画时长',
      type: 'slider',
      default: 2000,
      min: 1000,
      max: 5000,
      description: '毫秒（1000ms = 1秒）'
    }
  ]
};
