import { ToolConfig } from '../types';

export const photoshootConfig: ToolConfig = {
  id: 'photoshoot',
  presets: [
    {
      id: 'professional',
      name: '职业照',
      description: '正式商务形象',
      params: { style: 'professional', background: 'studio' }
    },
    {
      id: 'casual',
      name: '生活照',
      description: '自然随性风格',
      params: { style: 'casual', background: 'outdoor' }
    },
    {
      id: 'artistic',
      name: '艺术照',
      description: '创意艺术风格',
      params: { style: 'artistic', background: 'creative' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '拍摄风格',
      type: 'select',
      default: 'professional',
      options: [
        { value: 'professional', label: '职业照' },
        { value: 'casual', label: '生活照' },
        { value: 'artistic', label: '艺术照' },
        { value: 'fashion', label: '时尚大片' }
      ]
    },
    {
      id: 'background',
      name: '背景场景',
      type: 'select',
      default: 'studio',
      options: [
        { value: 'studio', label: '影棚' },
        { value: 'outdoor', label: '户外' },
        { value: 'creative', label: '创意' }
      ]
    }
  ]
};
