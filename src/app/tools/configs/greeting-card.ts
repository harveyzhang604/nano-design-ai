import { ToolConfig } from '../types';

export const greetingcardConfig: ToolConfig = {
  id: 'greeting-card',
  presets: [

  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'natural', options: [
      { value: 'natural', label: '自然' }, { value: 'enhanced', label: '增强' }, { value: 'artistic', label: '艺术' }
    ]},
  ]
};
