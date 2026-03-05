import { ToolConfig } from '../types';

export const removeBgConfig: ToolConfig = {
  id: 'remove-bg',
  presets: [
    {
      id: 'precise',
      name: '精准边缘',
      description: '锐利边缘，适合产品图',
      params: { edgeMode: 'precise' }
    },
    {
      id: 'soft',
      name: '柔和边缘',
      description: '自然羽化，适合人像',
      params: { edgeMode: 'soft' }
    },
    {
      id: 'detail',
      name: '保留细节',
      description: '保留头发等细节',
      params: { edgeMode: 'detail' }
    }
  ],
  params: [
    {
      id: 'edgeMode',
      name: '边缘处理',
      type: 'select',
      default: 'soft',
      options: [
        { value: 'precise', label: '精准' },
        { value: 'soft', label: '柔和' },
        { value: 'detail', label: '细节' }
      ]
    }
  ]
};
