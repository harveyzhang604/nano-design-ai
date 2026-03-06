import { ToolConfig } from '../types';

export const productPhotoConfig: ToolConfig = {
  id: 'product-photo',
  presets: [
  ],
  params: [
    { id: 'background', name: '背景', type: 'select', default: 'white', options: [
      { value: 'white', label: '纯白' }, { value: 'gradient', label: '渐变' }, { value: 'scene', label: '场景' }
    ]},
    { id: 'lighting', name: '光照', type: 'select', default: 'studio', options: [
      { value: 'studio', label: '影棚光' }, { value: 'natural', label: '自然光' }, { value: 'dramatic', label: '戏剧光' }, { value: 'soft', label: '柔和光' }
    ]}
  ]
};
