import { ToolConfig } from '../types';

export const italianGestureConfig: ToolConfig = {
  id: 'italian-gesture',
  presets: [
    { 
      id: 'chef-kiss', 
      name: '厨师之吻 👨‍🍳', 
      description: '经典的意大利"完美"手势', 
      params: { gesture: 'chef-kiss', intensity: 85 } 
    },
    { 
      id: 'ma-che-vuoi', 
      name: 'Ma Che Vuoi 🤌', 
      description: '最经典的意大利手势"你想要什么"', 
      params: { gesture: 'ma-che-vuoi', intensity: 90 } 
    },
    { 
      id: 'perfetto', 
      name: 'Perfetto 👌', 
      description: '完美手势', 
      params: { gesture: 'perfetto', intensity: 80 } 
    },
    { 
      id: 'mamma-mia', 
      name: 'Mamma Mia 🙌', 
      description: '惊叹手势', 
      params: { gesture: 'mamma-mia', intensity: 85 } 
    }
  ],
  params: [
    { 
      id: 'gesture', 
      name: '手势类型', 
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
      description: '手势的夸张程度'
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
