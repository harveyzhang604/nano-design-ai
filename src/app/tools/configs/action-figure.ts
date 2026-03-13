import { ToolConfig } from '../types';

export const actionFigureConfig: ToolConfig = {
  id: 'action-figure',
  presets: [
    { 
      id: 'marvel-legends', 
      name: 'Marvel Legends 🦸', 
      description: '漫威传奇系列手办', 
      params: { style: 'marvel-legends', scale: '6-inch', articulation: 'high' } 
    },
    { 
      id: 'hot-toys', 
      name: 'Hot Toys 🎬', 
      description: '超精细电影手办', 
      params: { style: 'hot-toys', scale: '12-inch', articulation: 'ultra' } 
    },
    { 
      id: 'neca', 
      name: 'NECA 风格 👾', 
      description: '经典动作手办', 
      params: { style: 'neca', scale: '7-inch', articulation: 'medium' } 
    },
    { 
      id: 'figma', 
      name: 'Figma 日系 🎌', 
      description: '日系可动手办', 
      params: { style: 'figma', scale: '6-inch', articulation: 'high' } 
    },
    { 
      id: 'vintage', 
      name: '复古手办 📼', 
      description: '80年代经典风格', 
      params: { style: 'vintage', scale: '3.75-inch', articulation: 'basic' } 
    }
  ],
  params: [
    { 
      id: 'style', 
      name: '手办系列', 
      type: 'select', 
      default: 'marvel-legends', 
      options: [
        { value: 'marvel-legends', label: 'Marvel Legends (漫威传奇)' },
        { value: 'hot-toys', label: 'Hot Toys (超精细)' },
        { value: 'neca', label: 'NECA (经典动作)' },
        { value: 'figma', label: 'Figma (日系可动)' },
        { value: 'vintage', label: 'Vintage (复古80年代)' }
      ]
    },
    { 
      id: 'scale', 
      name: '比例尺寸', 
      type: 'select', 
      default: '6-inch', 
      options: [
        { value: '3.75-inch', label: '3.75英寸 (复古)' },
        { value: '6-inch', label: '6英寸 (标准)' },
        { value: '7-inch', label: '7英寸 (大型)' },
        { value: '12-inch', label: '12英寸 (1/6比例)' }
      ]
    },
    {
      id: 'articulation',
      name: '可动性',
      type: 'select',
      default: 'high',
      options: [
        { value: 'basic', label: '基础可动 (5点)' },
        { value: 'medium', label: '中等可动 (15点)' },
        { value: 'high', label: '高度可动 (30点)' },
        { value: 'ultra', label: '超级可动 (50+点)' }
      ]
    },
    {
      id: 'packaging',
      name: '包装展示',
      type: 'select',
      default: 'window-box',
      options: [
        { value: 'none', label: '无包装' },
        { value: 'window-box', label: '开窗盒装' },
        { value: 'blister', label: '吸塑卡装' },
        { value: 'premium', label: '豪华包装' }
      ]
    },
    {
      id: 'pose',
      name: '动作姿势',
      type: 'select',
      default: 'dynamic',
      options: [
        { value: 'neutral', label: '中立站姿' },
        { value: 'dynamic', label: '动态姿势' },
        { value: 'heroic', label: '英雄姿态' },
        { value: 'battle', label: '战斗姿势' }
      ]
    }
  ]
};
