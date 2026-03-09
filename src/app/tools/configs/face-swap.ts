import { ToolConfig } from '../types';

export const faceSwapConfig: ToolConfig = {
  id: 'face-swap',
  presets: [
    { id: 'natural', name: '自然换脸', description: '自然融合', params: { targetImageUrl: '', style: 'natural', intensity: 85 } },
    { id: 'celebrity', name: '明星脸', description: '明星换脸', params: { targetImageUrl: '', style: 'celebrity', intensity: 80 } }
  ],
  params: [
    { id: 'targetImageUrl', name: '目标人脸图片URL', type: 'text', default: '', placeholder: '粘贴目标人脸图片URL...' },
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' },
      { value: 'celebrity', label: '明星' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 85, min: 0, max: 100 }
  ]
};
