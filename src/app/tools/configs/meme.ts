import { ToolConfig } from '../types';

export const memeConfig: ToolConfig = {
  id: 'meme',
  presets: [
    { id: 'brainrot', name: '🧠 脑腐风格', description: 'TikTok超现实主义爆款', params: { text: '我的脑子', template: 'brainrot', intensity: 90 }, popular: true },
    { id: 'funny', name: '😂 搞笑风格', description: '幽默传播力强', params: { text: '哈哈哈', template: 'funny', intensity: 80 }, recommended: true },
    { id: 'sarcastic', name: '🙄 讽刺风格', description: '讽刺幽默表情包', params: { text: '呵呵', template: 'sarcastic', intensity: 75 } },
    { id: 'motivational', name: '💪 励志风格', description: '正能量激励表情包', params: { text: '加油', template: 'motivational', intensity: 75 } },
    { id: 'cute', name: '🥰 可爱风格', description: '萌系温馨表情包', params: { text: '么么哒', template: 'cute', intensity: 85 } }
  ],
  params: [
    { id: 'text', name: '文字内容', type: 'text', default: '输入表情包文字', placeholder: '输入搞笑文案，AI自动配图...', tooltip: '简短有力的文字效果最好，10字以内' },
    { id: 'template', name: '风格', type: 'select', default: 'brainrot', options: [
      { value: 'brainrot', label: '🧠 脑腐 (最热门)' },
      { value: 'funny', label: '😂 搞笑' },
      { value: 'sarcastic', label: '🙄 讽刺' },
      { value: 'motivational', label: '💪 励志' },
      { value: 'cute', label: '🥰 可爱' }
    ]}
  ],
  tips: [
    '脑腐风格是2026年TikTok最热表情包流派，超现实主义、越荒诞越火',
    '文字越简短越有力，配合荒诞图片效果最好',
    '搞笑风格适合日常分享，讽刺风格适合评论区互动'
  ]
};
