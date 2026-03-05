import { ToolConfig } from '../types';

export const cartoonConfig: ToolConfig = {
  id: 'cartoon',
  presets: [
    {
      id: 'anime',
      name: '日系动漫',
      description: '二次元风格',
      params: { style: 'anime' }
    },
    {
      id: 'disney',
      name: '迪士尼风格',
      description: '美式卡通',
      params: { style: 'disney' }
    },
    {
      id: '3d',
      name: '3D卡通',
      description: '立体卡通效果',
      params: { style: '3d' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '卡通风格',
      type: 'select',
      default: 'anime',
      options: [
        { value: 'anime', label: '日系动漫' },
        { value: 'disney', label: '迪士尼' },
        { value: '3d', label: '3D卡通' },
        { value: 'comic', label: '漫画' }
      ]
    }
  ]
};
