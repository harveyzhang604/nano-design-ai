import { ToolConfig } from '../types';

export const emojiGenConfig: ToolConfig = {
  id: 'emoji-gen',
  presets: [
    {
      id: 'cute',
      name: '可爱风格',
      description: '萌系表情包',
      params: { style: 'cute' }
    },
    {
      id: 'funny',
      name: '搞笑风格',
      description: '幽默表情包',
      params: { style: 'funny' }
    },
    {
      id: 'realistic',
      name: '写实风格',
      description: '真实表情',
      params: { style: 'realistic' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '表情风格',
      type: 'select',
      default: 'cute',
      options: [
        { value: 'cute', label: '可爱' },
        { value: 'funny', label: '搞笑' },
        { value: 'realistic', label: '写实' },
        { value: 'cartoon', label: '卡通' }
      ]
    }
  ]
};
