import { ToolConfig } from '../types';

export const makeupConfig: ToolConfig = {
  id: 'makeup',
  presets: [
    { id: 'natural', name: '自然妆容', description: '清新自然妆', params: { style: 'natural', intensity: 60 } },
    { id: 'glamour', name: '魅力妆容', description: '时尚魅力妆', params: { style: 'glamour', intensity: 80 } },
    { id: 'party', name: '派对妆容', description: '派对浓妆', params: { style: 'party', intensity: 90 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' },
      { value: 'glamour', label: '魅力' },
      { value: 'party', label: '派对' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 70, min: 0, max: 100 }
  ]
};
