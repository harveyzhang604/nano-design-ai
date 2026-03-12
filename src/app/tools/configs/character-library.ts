import { ToolConfig } from '../types';

export const characterLibraryConfig: ToolConfig = {
  id: 'character-library',
  presets: [
    {
      id: 'brand-mascot',
      name: '品牌吉祥物',
      description: '保存品牌角色，生成不同场景营销素材',
      params: { 
        action: 'generate',
        scene: 'product showcase',
        style: 'professional photography'
      }
    },
    {
      id: 'personal-ip',
      name: '个人IP形象',
      description: '保存个人形象，生成不同内容场景',
      params: { 
        action: 'generate',
        scene: 'content creation',
        style: 'natural and authentic'
      }
    },
    {
      id: 'character-story',
      name: '角色故事',
      description: '同一角色的多个故事场景',
      params: { 
        action: 'generate',
        scene: 'storytelling scene',
        style: 'cinematic'
      }
    },
    {
      id: 'social-media',
      name: '社交媒体',
      description: '角色在不同社交场景',
      params: { 
        action: 'generate',
        scene: 'social media post',
        style: 'casual and engaging'
      }
    }
  ],
  params: [
    {
      id: 'action',
      name: '操作',
      type: 'select',
      default: 'generate',
      options: [
        { value: 'save', label: '保存角色' },
        { value: 'generate', label: '生成新场景' }
      ]
    },
    {
      id: 'characterName',
      name: '角色名称',
      type: 'text',
      default: '',
      description: '为角色命名（保存时必填）'
    },
    {
      id: 'scene',
      name: '场景描述',
      type: 'text',
      default: '',
      description: '描述新场景（如：在咖啡厅、在海边、在办公室）'
    },
    {
      id: 'style',
      name: '风格',
      type: 'select',
      default: 'natural',
      options: [
        { value: 'natural', label: '自然真实' },
        { value: 'professional photography', label: '专业摄影' },
        { value: 'cinematic', label: '电影感' },
        { value: 'casual', label: '休闲随意' },
        { value: 'artistic', label: '艺术化' }
      ]
    },
    {
      id: 'pose',
      name: '姿势',
      type: 'text',
      default: '',
      description: '描述姿势（如：站立、坐着、跳跃）'
    },
    {
      id: 'clothing',
      name: '服装',
      type: 'text',
      default: '',
      description: '描述服装（如：西装、休闲装、运动服）'
    },
    {
      id: 'background',
      name: '背景',
      type: 'text',
      default: '',
      description: '描述背景（如：城市街道、自然风光、室内）'
    }
  ]
};
