import { ToolConfig } from '../types';

export const styleMixConfig: ToolConfig = {
  id: 'style-mix',
  presets: [
    {
      id: 'neon-ghibli',
      name: '霓虹吉卜力',
      description: '80s霓虹 + 宫崎骏手绘',
      params: { 
        styles: ['80s-neon', 'ghibli'],
        blendMode: 'balanced'
      }
    },
    {
      id: 'cyber-watercolor',
      name: '赛博水彩',
      description: '赛博朋克 + 水彩画',
      params: { 
        styles: ['cyberpunk', 'watercolor'],
        blendMode: 'balanced'
      }
    },
    {
      id: 'vintage-pop',
      name: '复古波普',
      description: '70s复古 + 波普艺术',
      params: { 
        styles: ['vintage-70s', 'pop-art'],
        blendMode: 'balanced'
      }
    },
    {
      id: 'noir-impressionist',
      name: '黑色印象派',
      description: '黑色电影 + 印象派',
      params: { 
        styles: ['film-noir', 'impressionist'],
        blendMode: 'balanced'
      }
    },
    {
      id: 'triple-fusion',
      name: '三重融合',
      description: 'Ghibli + 水彩 + 极简',
      params: { 
        styles: ['ghibli', 'watercolor', 'minimalist'],
        blendMode: 'balanced'
      }
    }
  ],
  params: [
    {
      id: 'styles',
      name: '风格组合',
      type: 'multiselect',
      default: [],
      options: [
        { value: 'ghibli', label: 'Ghibli 吉卜力' },
        { value: '80s-neon', label: '80s 霓虹' },
        { value: 'film-noir', label: '黑色电影' },
        { value: 'watercolor', label: '水彩画' },
        { value: 'cyberpunk', label: '赛博朋克' },
        { value: 'vintage-70s', label: '70s 复古' },
        { value: 'minimalist', label: '极简主义' },
        { value: 'baroque', label: '巴洛克' },
        { value: 'pop-art', label: '波普艺术' },
        { value: 'impressionist', label: '印象派' }
      ],
      description: '选择2-3种风格混合（最多3种）'
    },
    {
      id: 'blendMode',
      name: '混合模式',
      type: 'select',
      default: 'balanced',
      options: [
        { value: 'balanced', label: '均衡混合' },
        { value: 'dominant-first', label: '主次分明' },
        { value: 'layered', label: '分层叠加' }
      ],
      description: '控制风格混合方式'
    }
  ]
};
