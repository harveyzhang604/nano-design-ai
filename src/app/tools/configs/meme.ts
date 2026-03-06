import { ToolConfig } from '../types';

export const memeConfig: ToolConfig = {
  id: 'meme',
  presets: [
    { id: 'funny', name: '搞笑表情', description: '幽默搞笑风格', params: { style: 'funny', intensity: 80 } },
    { id: 'cute', name: '可爱萌系', description: '萌系可爱风格', params: { style: 'cute', intensity: 75 } },
    { id: 'cool', name: '酷炫风格', description: '帅气酷炫效果', params: { style: 'cool', intensity: 70 } },
    { id: 'vintage', name: '复古表情', description: '怀旧复古风格', params: { style: 'vintage', intensity: 65 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'funny', options: [
      { value: 'funny', label: '搞笑' },
      { value: 'cute', label: '可爱' },
      { value: 'cool', label: '酷炫' },
      { value: 'vintage', label: '复古' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
