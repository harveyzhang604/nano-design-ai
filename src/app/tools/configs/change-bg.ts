import { ToolConfig } from '../types';

export const changeBgConfig: ToolConfig = {
  id: 'change-bg',
  presets: [
    {
      id: 'nature',
      name: '自然风景',
      description: '户外自然场景',
      params: { scene: 'nature' }
    },
    {
      id: 'studio',
      name: '影棚背景',
      description: '专业影棚效果',
      params: { scene: 'studio' }
    },
    {
      id: 'urban',
      name: '城市街景',
      description: '现代城市背景',
      params: { scene: 'urban' }
    }
  ],
  params: [
    {
      id: 'scene',
      name: '背景场景',
      type: 'select',
      default: 'studio',
      options: [
        { value: 'nature', label: '自然' },
        { value: 'studio', label: '影棚' },
        { value: 'urban', label: '城市' },
        { value: 'abstract', label: '抽象' }
      ]
    }
  ]
};
