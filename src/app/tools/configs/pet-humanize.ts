import { ToolConfig } from '../types';

export const petHumanizeConfig: ToolConfig = {
  id: 'pet-humanize',
  presets: [
    { 
      id: 'elegant', 
      name: '优雅绅士 🎩', 
      description: '优雅的人类形象', 
      params: { style: 'elegant', clothing: 'formal' } 
    },
    { 
      id: 'casual', 
      name: '休闲风格 👕', 
      description: '日常休闲装扮', 
      params: { style: 'casual', clothing: 'casual' } 
    },
    { 
      id: 'anime', 
      name: '动漫角色 ✨', 
      description: '动漫风格拟人化', 
      params: { style: 'anime', clothing: 'anime' } 
    },
    { 
      id: 'fantasy', 
      name: '奇幻角色 🗡️', 
      description: '奇幻世界的角色', 
      params: { style: 'fantasy', clothing: 'fantasy' } 
    }
  ],
  params: [
    { 
      id: 'style', 
      name: '拟人风格', 
      type: 'select', 
      default: 'elegant', 
      options: [
        { value: 'elegant', label: '优雅绅士 🎩' },
        { value: 'casual', label: '休闲风格 👕' },
        { value: 'anime', label: '动漫角色 ✨' },
        { value: 'fantasy', label: '奇幻角色 🗡️' },
        { value: 'modern', label: '现代时尚 👔' },
        { value: 'vintage', label: '复古风格 🎭' }
      ]
    },
    { 
      id: 'clothing', 
      name: '服装风格', 
      type: 'select', 
      default: 'formal', 
      options: [
        { value: 'formal', label: '正装' },
        { value: 'casual', label: '休闲装' },
        { value: 'anime', label: '动漫服装' },
        { value: 'fantasy', label: '奇幻装备' },
        { value: 'modern', label: '现代时尚' },
        { value: 'traditional', label: '传统服饰' }
      ]
    },
    {
      id: 'keepFeatures',
      name: '保留特征',
      type: 'slider',
      default: 85,
      min: 60,
      max: 100,
      description: '保留宠物原有特征的程度'
    },
    {
      id: 'background',
      name: '背景',
      type: 'select',
      default: 'portrait',
      options: [
        { value: 'portrait', label: '肖像背景' },
        { value: 'fantasy', label: '奇幻场景' },
        { value: 'modern', label: '现代都市' },
        { value: 'nature', label: '自然风光' }
      ]
    }
  ]
};
