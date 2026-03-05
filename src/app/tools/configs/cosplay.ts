import { ToolConfig } from '../types';

export const cosplayConfig: ToolConfig = {
  id: 'cosplay',
  presets: [
    {
      id: 'anime',
      name: '动漫角色',
      description: '经典动漫Cos',
      params: { genre: 'anime' }
    },
    {
      id: 'game',
      name: '游戏角色',
      description: '游戏人物Cos',
      params: { genre: 'game' }
    },
    {
      id: 'fantasy',
      name: '奇幻角色',
      description: '魔幻风格',
      params: { genre: 'fantasy' }
    }
  ],
  params: [
    {
      id: 'genre',
      name: 'Cos类型',
      type: 'select',
      default: 'anime',
      options: [
        { value: 'anime', label: '动漫' },
        { value: 'game', label: '游戏' },
        { value: 'fantasy', label: '奇幻' }
      ]
    }
  ]
};
