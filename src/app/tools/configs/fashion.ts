import { ToolConfig } from '../types';

export const fashionConfig: ToolConfig = {
  id: 'fashion',
  presets: [
    {
      id: 'casual',
      name: '休闲风格',
      description: '日常休闲穿搭',
      params: { style: 'casual', season: 'spring' }
    },
    {
      id: 'formal',
      name: '正式风格',
      description: '商务正装',
      params: { style: 'formal', season: 'spring' }
    },
    {
      id: 'trendy',
      name: '时尚风格',
      description: '潮流时尚',
      params: { style: 'trendy', season: 'spring' }
    }
  ],
  params: [
    {
      id: 'style',
      name: '服装风格',
      type: 'select',
      default: 'casual',
      options: [
        { value: 'casual', label: '休闲' },
        { value: 'formal', label: '正式' },
        { value: 'trendy', label: '时尚' },
        { value: 'vintage', label: '复古' }
      ]
    },
    {
      id: 'season',
      name: '季节',
      type: 'select',
      default: 'spring',
      options: [
        { value: 'spring', label: '春季' },
        { value: 'summer', label: '夏季' },
        { value: 'autumn', label: '秋季' },
        { value: 'winter', label: '冬季' }
      ]
    }
  ]
};
