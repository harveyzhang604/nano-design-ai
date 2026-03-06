import { ToolConfig } from '../types';

export const cosplayConfig: ToolConfig = {
  id: 'cosplay',
  presets: [
    { id: 'anime', name: '动漫角色', description: '动漫角色扮演', params: { style: 'anime', intensity: 85 } },
    { id: 'superhero', name: '超级英雄', description: '超级英雄装扮', params: { style: 'superhero', intensity: 80 } },
    { id: 'fantasy', name: '奇幻角色', description: '奇幻世界角色', params: { style: 'fantasy', intensity: 85 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'anime', options: [
      { value: 'anime', label: '动漫' },
      { value: 'superhero', label: '英雄' },
      { value: 'fantasy', label: '奇幻' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 85, min: 0, max: 100 }
  ]
};
