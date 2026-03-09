import { ToolConfig } from '../types';

export const styleTransferProConfig: ToolConfig = {
  id: 'style-transfer-pro',
  presets: [
    { id: 'oil', name: '油画', description: '经典油画风格', params: { style: 'oil', intensity: 80, brushSize: 'medium' } },
    { id: 'watercolor', name: '水彩', description: '水彩画风格', params: { style: 'watercolor', intensity: 75, brushSize: 'soft' } },
    { id: 'sketch', name: '素描', description: '铅笔素描风格', params: { style: 'sketch', intensity: 70, brushSize: 'fine' } },
    { id: 'impressionism', name: '印象派', description: '印象派画风', params: { style: 'impressionism', intensity: 85, brushSize: 'large' } },
    { id: 'abstract', name: '抽象', description: '抽象艺术风格', params: { style: 'abstract', intensity: 90, brushSize: 'varied' } },
    { id: 'ukiyoe', name: '浮世绘', description: '日本浮世绘', params: { style: 'ukiyoe', intensity: 80, brushSize: 'medium' } },
    { id: 'cubism', name: '立体主义', description: '立体派风格', params: { style: 'cubism', intensity: 85, brushSize: 'geometric' } },
    { id: 'pop', name: '波普艺术', description: '波普艺术风格', params: { style: 'pop', intensity: 80, brushSize: 'bold' } },
    { id: 'chinese', name: '国画', description: '中国水墨画', params: { style: 'chinese', intensity: 75, brushSize: 'ink' } },
    { id: 'vangogh', name: '梵高风格', description: '梵高画风', params: { style: 'vangogh', intensity: 85, brushSize: 'swirl' } }
  ],
  params: [
    { 
      id: 'style', 
      name: '艺术风格', 
      type: 'select', 
      default: 'oil', 
      options: [
        { value: 'oil', label: '油画' },
        { value: 'watercolor', label: '水彩' },
        { value: 'sketch', label: '素描' },
        { value: 'impressionism', label: '印象派' },
        { value: 'abstract', label: '抽象' },
        { value: 'ukiyoe', label: '浮世绘' },
        { value: 'cubism', label: '立体主义' },
        { value: 'pop', label: '波普艺术' },
        { value: 'chinese', label: '国画' },
        { value: 'vangogh', label: '梵高风格' }
      ]
    },
    { id: 'intensity', name: '风格强度', type: 'slider', default: 80, min: 0, max: 100 },
    { 
      id: 'brushSize', 
      name: '笔触大小', 
      type: 'select', 
      default: 'medium', 
      options: [
        { value: 'fine', label: '细腻' },
        { value: 'medium', label: '中等' },
        { value: 'large', label: '粗犷' },
        { value: 'varied', label: '多变' }
      ]
    },
    { id: 'keepDetail', name: '保留细节', type: 'toggle', default: true }
  ]
};
