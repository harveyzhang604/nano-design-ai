import { ToolConfig } from '../types';

export const authenticityConfig: ToolConfig = {
  id: 'authenticity',
  presets: [
    {
      id: 'authentic',
      name: '高度真实',
      description: '保留胶片颗粒、自然光泄漏、真实皮肤纹理',
      params: { 
        authenticity: 20,
        task: 'enhance'
      }
    },
    {
      id: 'balanced',
      name: '自然平衡',
      description: '轻微优化，保持真实感',
      params: { 
        authenticity: 50,
        task: 'enhance'
      }
    },
    {
      id: 'polished',
      name: '专业完美',
      description: '杂志级别的完美效果',
      params: { 
        authenticity: 85,
        task: 'enhance'
      }
    },
    {
      id: 'portrait-real',
      name: '真实人像',
      description: '保留皮肤纹理和自然表情',
      params: { 
        authenticity: 30,
        task: 'portrait enhancement'
      }
    },
    {
      id: 'portrait-perfect',
      name: '完美人像',
      description: '专业人像摄影效果',
      params: { 
        authenticity: 80,
        task: 'portrait enhancement'
      }
    }
  ],
  params: [
    {
      id: 'authenticity',
      name: '真实感',
      type: 'slider',
      default: 50,
      min: 0,
      max: 100,
      description: '0=完全真实（保留瑕疵），100=完美化'
    },
    {
      id: 'task',
      name: '处理任务',
      type: 'select',
      default: 'enhance',
      options: [
        { value: 'enhance', label: '整体增强' },
        { value: 'portrait enhancement', label: '人像增强' },
        { value: 'color correction', label: '色彩校正' },
        { value: 'clarity boost', label: '清晰度提升' }
      ]
    }
  ]
};
