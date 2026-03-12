import { ToolConfig } from '../types';

export const petFamilyConfig: ToolConfig = {
  id: 'pet-family',
  presets: [
    {
      id: 'family-portrait',
      name: '家庭合影',
      description: '正式家庭合影，温馨有爱',
      params: { 
        scene: 'family-portrait',
        style: 'realistic'
      }
    },
    {
      id: 'casual-friends',
      name: '好友聚会',
      description: '休闲朋友聚会，轻松有趣',
      params: { 
        scene: 'casual-group',
        style: 'realistic'
      }
    },
    {
      id: 'anime-squad',
      name: '动漫小队',
      description: '动漫风格团队照',
      params: { 
        scene: 'casual-group',
        style: 'anime'
      }
    },
    {
      id: 'chibi-family',
      name: 'Q版家族',
      description: '超萌Q版全家福',
      params: { 
        scene: 'family-portrait',
        style: 'chibi'
      }
    },
    {
      id: 'adventure-team',
      name: '冒险队伍',
      description: '户外冒险团队照',
      params: { 
        scene: 'adventure',
        style: 'cartoon'
      }
    }
  ],
  params: [
    {
      id: 'petImages',
      name: '宠物图片',
      type: 'multiimage',
      default: [],
      description: '上传2-5张宠物照片'
    },
    {
      id: 'scene',
      name: '场景',
      type: 'select',
      default: 'family-portrait',
      options: [
        { value: 'family-portrait', label: '家庭合影' },
        { value: 'casual-group', label: '休闲聚会' },
        { value: 'adventure', label: '户外冒险' },
        { value: 'celebration', label: '庆祝派对' },
        { value: 'cozy-home', label: '温馨居家' }
      ]
    },
    {
      id: 'style',
      name: '风格',
      type: 'select',
      default: 'realistic',
      options: [
        { value: 'realistic', label: '写实风格' },
        { value: 'anime', label: '动漫风格' },
        { value: 'cartoon', label: '卡通风格' },
        { value: 'chibi', label: 'Q版风格' }
      ]
    }
  ]
};
