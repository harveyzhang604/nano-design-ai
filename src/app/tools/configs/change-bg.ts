import { ToolConfig } from '../types';

export const changeBgConfig: ToolConfig = {
  id: 'change-bg',
  presets: [
    { id: 'nature', name: '自然风光', description: '山川湖海背景', params: { background: '美丽的自然风光，山川湖海', style: 'nature', intensity: 80 } },
    { id: 'city', name: '城市街景', description: '现代都市背景', params: { background: '现代城市街景，高楼大厦', style: 'city', intensity: 75 } },
    { id: 'studio', name: '摄影棚', description: '专业摄影背景', params: { background: '专业摄影棚，纯色背景', style: 'studio', intensity: 85 } },
    { id: 'fantasy', name: '梦幻场景', description: '奇幻背景', params: { background: '梦幻奇幻场景', style: 'fantasy', intensity: 90 } }
  ],
  params: [
    { id: 'background', name: '背景描述', type: 'text', default: '美丽的自然风光', placeholder: '描述想要的背景...' },
    { id: 'style', name: '风格', type: 'select', default: 'nature', options: [
      { value: 'nature', label: '自然' },
      { value: 'city', label: '城市' },
      { value: 'studio', label: '摄影棚' },
      { value: 'fantasy', label: '梦幻' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
