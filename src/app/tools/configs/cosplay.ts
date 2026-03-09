import { ToolConfig } from '../types';

export const cosplayConfig: ToolConfig = {
  id: 'cosplay',
  presets: [
    { id: 'anime', name: '动漫角色', description: '动漫Cos', params: { character: '动漫角色', style: 'anime', intensity: 85 } },
    { id: 'game', name: '游戏角色', description: '游戏Cos', params: { character: '游戏角色', style: 'game', intensity: 80 } },
    { id: 'movie', name: '电影角色', description: '电影Cos', params: { character: '电影角色', style: 'movie', intensity: 75 } }
  ],
  params: [
    { id: 'character', name: '角色名称', type: 'text', default: '动漫角色', placeholder: '输入想Cos的角色...' },
    { id: 'style', name: '风格', type: 'select', default: 'anime', options: [
      { value: 'anime', label: '动漫' },
      { value: 'game', label: '游戏' },
      { value: 'movie', label: '电影' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
