import { ToolConfig } from '../types';

export const composeConfig: ToolConfig = {
  id: 'compose',
  presets: [
    {
      id: 'guided-compose',
      name: '描述式合成',
      description: '按图1/图2/图3指定元素进行合成',
      params: {
        compositionPrompt: '',
        mode: 'guided',
        intensity: 70
      }
    },
    {
      id: 'blend',
      name: '自由混合',
      description: '自然融合多张图片',
      params: {
        compositionPrompt: '',
        mode: 'blend',
        intensity: 50
      }
    },
    {
      id: 'collage',
      name: '拼贴模式',
      description: '保留多图元素的拼贴感',
      params: {
        compositionPrompt: '',
        mode: 'collage',
        intensity: 60
      }
    }
  ],
  params: [
    {
      id: 'compositionPrompt',
      name: '合成描述',
      type: 'textarea',
      default: '',
      placeholder: '例：图1的人物，穿图2的衣服，戴图3的眼镜，背景保持图1，自然写实。'
    },
    { id: 'mode', name: '合成模式', type: 'select', default: 'guided', options: [
      { value: 'guided', label: '描述式合成' },
      { value: 'blend', label: '自然混合' },
      { value: 'artistic', label: '艺术融合' },
      { value: 'collage', label: '拼贴组合' }
    ]},
    { id: 'intensity', name: '合成强度', type: 'slider', default: 70, min: 0, max: 100 }
  ],
  tips: [
    '用“图1/图2/图3”明确指定来源，例如：图1的人，图2的外套，图3的墨镜。',
    '描述越具体，结果越稳定，比如补充姿势、背景、写实/插画风格。',
    '建议 2-4 张图，元素职责清晰，不要每张图都承担太多信息。'
  ]
};
