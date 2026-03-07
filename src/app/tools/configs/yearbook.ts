import { ToolConfig } from '../types';

export const yearbookConfig: ToolConfig = {
  id: 'yearbook',
  presets: [
    { id: '80s', name: '80年代年鉴照', description: '1980年代复古风格', params: { decade: '80s' } },
    { id: '90s', name: '90年代年鉴照', description: '1990年代复古风格', params: { decade: '90s' } },
    { id: '00s', name: '00年代年鉴照', description: '2000年代复古风格', params: { decade: '00s' } },
    { id: '70s', name: '70年代年鉴照', description: '1970年代复古风格', params: { decade: '70s' } }
  ],
  params: [
    { id: 'decade', name: '年代', type: 'select', default: '90s', options: [
      { value: '70s', label: '70年代' },
      { value: '80s', label: '80年代' },
      { value: '90s', label: '90年代' },
      { value: '00s', label: '00年代' }
    ]},
    { id: 'gender', name: '性别', type: 'select', default: 'auto', options: [
      { value: 'auto', label: '自动识别' },
      { value: 'male', label: '男性' },
      { value: 'female', label: '女性' }
    ]}
  ]
};
