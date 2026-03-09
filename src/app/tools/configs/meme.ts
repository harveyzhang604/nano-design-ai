import { ToolConfig } from '../types';

export const memeConfig: ToolConfig = {
  id: 'meme',
  presets: [
    { id: 'funny', name: '搞笑风格', description: '幽默表情包', params: { text: '哈哈哈', style: 'funny', intensity: 80 } },
    { id: 'sarcastic', name: '讽刺风格', description: '讽刺表情包', params: { text: '呵呵', style: 'sarcastic', intensity: 75 } },
    { id: 'cute', name: '可爱风格', description: '萌系表情包', params: { text: '么么哒', style: 'cute', intensity: 85 } }
  ],
  params: [
    { id: 'text', name: '文字内容', type: 'text', default: '哈哈哈', placeholder: '输入表情包文字...' },
    { id: 'style', name: '风格', type: 'select', default: 'funny', options: [
      { value: 'funny', label: '搞笑' },
      { value: 'sarcastic', label: '讽刺' },
      { value: 'cute', label: '可爱' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 80, min: 0, max: 100 }
  ]
};
