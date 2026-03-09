import { ToolConfig } from '../types';

export const outfitChangeConfig: ToolConfig = {
  id: 'outfit-change',
  presets: [
    { id: 'casual', name: '休闲装', description: '日常休闲风格', params: { style: 'casual', fit: 'regular' } },
    { id: 'formal', name: '正装', description: '商务正装', params: { style: 'formal', fit: 'slim' } },
    { id: 'sport', name: '运动装', description: '运动休闲风', params: { style: 'sport', fit: 'loose' } },
    { id: 'elegant', name: '优雅礼服', description: '晚礼服风格', params: { style: 'elegant', fit: 'fitted' } },
    { id: 'street', name: '街头潮流', description: '潮流街头风', params: { style: 'street', fit: 'oversized' } }
  ],
  params: [
    { 
      id: 'style', 
      name: '服装风格', 
      type: 'select', 
      default: 'casual', 
      options: [
        { value: 'casual', label: '休闲装' },
        { value: 'formal', label: '正装' },
        { value: 'sport', label: '运动装' },
        { value: 'elegant', label: '优雅礼服' },
        { value: 'street', label: '街头潮流' }
      ]
    },
    { 
      id: 'fit', 
      name: '版型', 
      type: 'select', 
      default: 'regular', 
      options: [
        { value: 'slim', label: '修身' },
        { value: 'regular', label: '标准' },
        { value: 'loose', label: '宽松' },
        { value: 'oversized', label: '超宽松' },
        { value: 'fitted', label: '贴身' }
      ]
    },
    { id: 'keepColor', name: '保留原色', type: 'toggle', default: false }
  ]
};
