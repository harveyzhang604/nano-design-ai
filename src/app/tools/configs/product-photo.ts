import { ToolConfig } from '../types';

export const productPhotoConfig: ToolConfig = {
  id: 'product-photo',
  presets: [
    { id: 'ecommerce', name: '电商白底', description: '纯白背景，符合电商要求', params: { style: 'ecommerce', intensity: 80 } },
    { id: 'lifestyle', name: '生活场景', description: '真实场景，提升代入感', params: { style: 'lifestyle', intensity: 70 } },
    { id: 'premium', name: '高端质感', description: '奢华质感，适合高端产品', params: { style: 'premium', intensity: 85 } },
    { id: 'minimal', name: '极简风格', description: '简约设计，突出产品', params: { style: 'minimal', intensity: 75 } }
  ],
  params: [
    { id: 'style', name: '风格', type: 'select', default: 'ecommerce', options: [
      { value: 'ecommerce', label: '电商' },
      { value: 'lifestyle', label: '生活' },
      { value: 'premium', label: '高端' },
      { value: 'minimal', label: '极简' }
    ]},
    { id: 'intensity', name: '强度', type: 'slider', default: 75, min: 0, max: 100 }
  ]
};
