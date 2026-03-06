import { ToolConfig } from '../types';

export const colorizeConfig: ToolConfig = {
  id: 'colorize',
  presets: [
    {
      id: 'natural',
      name: '自然上色',
      description: '真实还原历史色彩，适合家庭老照片',
      params: { 
        style: 'natural',
        intensity: 70,
        skinTone: true
      }
    },
    {
      id: 'vintage',
      name: '复古怀旧',
      description: '复古色调，适合年代感照片',
      params: { 
        style: 'vintage',
        intensity: 80,
        skinTone: true
      }
    },
    {
      id: 'vibrant',
      name: '鲜艳明亮',
      description: '色彩饱和，适合风景、建筑',
      params: { 
        style: 'vibrant',
        intensity: 90,
        skinTone: false
      }
    },
    {
      id: 'cinematic',
      name: '电影质感',
      description: '电影级调色，适合艺术创作',
      params: { 
        style: 'cinematic',
        intensity: 75,
        skinTone: true
      }
    },
    {
      id: 'subtle',
      name: '淡雅上色',
      description: '轻度上色，保留黑白质感',
      params: { 
        style: 'subtle',
        intensity: 50,
        skinTone: true
      }
    }
  ],
  params: [
    {
      id: 'style',
      name: '色彩风格',
      type: 'select',
      default: 'natural',
      options: [
        { value: 'natural', label: '自然' },
        { value: 'vintage', label: '复古' },
        { value: 'vibrant', label: '鲜艳' },
        { value: 'cinematic', label: '电影' },
        { value: 'subtle', label: '淡雅' }
      ]
    },
    {
      id: 'intensity',
      name: '色彩强度',
      type: 'slider',
      default: 70,
      min: 0,
      max: 100
    },
    {
      id: 'skinTone',
      name: '优化肤色',
      type: 'toggle',
      default: true
    }
  ]
};
