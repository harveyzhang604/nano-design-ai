import { ToolConfig } from '../types';

export const ghibliConfig: ToolConfig = {
  id: 'ghibli',
  presets: [
    { 
      id: 'spirited-away', 
      name: '千与千寻 🏮', 
      description: '神秘梦幻的温泉小镇', 
      params: { style: 'spirited-away', atmosphere: 'magical' } 
    },
    { 
      id: 'totoro', 
      name: '龙猫 🌳', 
      description: '温暖治愈的田园风光', 
      params: { style: 'totoro', atmosphere: 'peaceful' } 
    },
    { 
      id: 'howls-castle', 
      name: '哈尔的移动城堡 🏰', 
      description: '奇幻浪漫的魔法世界', 
      params: { style: 'howls-castle', atmosphere: 'romantic' } 
    },
    { 
      id: 'ponyo', 
      name: '悬崖上的金鱼姬 🌊', 
      description: '清新明亮的海洋世界', 
      params: { style: 'ponyo', atmosphere: 'vibrant' } 
    },
    { 
      id: 'mononoke', 
      name: '幽灵公主 🌲', 
      description: '史诗般的自然与神灵', 
      params: { style: 'mononoke', atmosphere: 'epic' } 
    }
  ],
  params: [
    { 
      id: 'style', 
      name: 'Ghibli 作品', 
      type: 'select', 
      default: 'spirited-away', 
      options: [
        { value: 'spirited-away', label: '千与千寻 🏮' },
        { value: 'totoro', label: '龙猫 🌳' },
        { value: 'howls-castle', label: '哈尔的移动城堡 🏰' },
        { value: 'ponyo', label: '悬崖上的金鱼姬 🌊' },
        { value: 'mononoke', label: '幽灵公主 🌲' },
        { value: 'kiki', label: '魔女宅急便 🧹' }
      ]
    },
    { 
      id: 'atmosphere', 
      name: '氛围', 
      type: 'select', 
      default: 'magical', 
      options: [
        { value: 'magical', label: '魔法梦幻' },
        { value: 'peaceful', label: '宁静治愈' },
        { value: 'romantic', label: '浪漫温馨' },
        { value: 'vibrant', label: '活力明亮' },
        { value: 'epic', label: '史诗壮丽' }
      ]
    },
    {
      id: 'detailLevel',
      name: '细节程度',
      type: 'slider',
      default: 85,
      min: 60,
      max: 100,
      description: 'Ghibli 标志性的细腻背景'
    },
    {
      id: 'colorPalette',
      name: '色彩风格',
      type: 'select',
      default: 'warm',
      options: [
        { value: 'warm', label: '温暖色调' },
        { value: 'cool', label: '清冷色调' },
        { value: 'vibrant', label: '鲜艳明亮' },
        { value: 'muted', label: '柔和淡雅' }
      ]
    }
  ]
};
