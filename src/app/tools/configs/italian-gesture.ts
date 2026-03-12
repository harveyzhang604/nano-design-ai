import { ToolConfig } from '../types';

export const italianGestureConfig: ToolConfig = {
  id: 'italian-gesture',
  presets: [
    { 
      id: 'chef-kiss', 
      name: '厨师之吻 👨‍🍳', 
      description: '经典的意大利"完美"手势', 
      params: { gesture: 'chef-kiss', intensity: 85, combo: false } 
    },
    { 
      id: 'ma-che-vuoi', 
      name: 'Ma Che Vuoi 🤌', 
      description: '最经典的意大利手势"你想要什么"', 
      params: { gesture: 'ma-che-vuoi', intensity: 90, combo: false } 
    },
    { 
      id: 'perfetto', 
      name: 'Perfetto 👌', 
      description: '完美手势', 
      params: { gesture: 'perfetto', intensity: 80, combo: false } 
    },
    { 
      id: 'mamma-mia', 
      name: 'Mamma Mia 🙌', 
      description: '惊叹手势', 
      params: { gesture: 'mamma-mia', intensity: 85, combo: false } 
    },
    { 
      id: 'combo-passionate', 
      name: '激情组合 🤌🙌', 
      description: '双手组合手势，超级表现力', 
      params: { gesture: 'ma-che-vuoi', secondGesture: 'mamma-mia', intensity: 95, combo: true } 
    }
  ],
  params: [
    { 
      id: 'gesture', 
      name: '主手势', 
      type: 'select', 
      default: 'ma-che-vuoi', 
      options: [
        { value: 'chef-kiss', label: '厨师之吻 👨‍🍳' },
        { value: 'ma-che-vuoi', label: 'Ma Che Vuoi 🤌' },
        { value: 'perfetto', label: 'Perfetto 👌' },
        { value: 'mamma-mia', label: 'Mamma Mia 🙌' },
        { value: 'non-mi-rompere', label: 'Non Mi Rompere 🤚' },
        { value: 'basta', label: 'Basta ✋' }
      ]
    },
    { 
      id: 'intensity', 
      name: '表现力', 
      type: 'slider', 
      default: 85, 
      min: 50, 
      max: 100,
      description: '手势的夸张程度（50=含蓄，100=戏剧化）'
    },
    {
      id: 'combo',
      name: '手势组合',
      type: 'toggle',
      default: false,
      description: '启用双手组合手势'
    },
    {
      id: 'secondGesture',
      name: '副手势',
      type: 'select',
      default: 'perfetto',
      options: [
        { value: 'chef-kiss', label: '厨师之吻 👨‍🍳' },
        { value: 'ma-che-vuoi', label: 'Ma Che Vuoi 🤌' },
        { value: 'perfetto', label: 'Perfetto 👌' },
        { value: 'mamma-mia', label: 'Mamma Mia 🙌' },
        { value: 'non-mi-rompere', label: 'Non Mi Rompere 🤚' },
        { value: 'basta', label: 'Basta ✋' }
      ],
      description: '仅在启用组合时生效'
    },
    {
      id: 'background',
      name: '背景',
      type: 'select',
      default: 'italian-street',
      options: [
        { value: 'italian-street', label: '意大利街景' },
        { value: 'restaurant', label: '意大利餐厅' },
        { value: 'kitchen', label: '厨房' },
        { value: 'original', label: '保持原背景' }
      ]
    }
  ]
};
