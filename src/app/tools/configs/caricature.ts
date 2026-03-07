import { ToolConfig } from '../types';

export const caricatureConfig: ToolConfig = {
  id: 'caricature',
  presets: [
    { id: 'developer-fun', name: '程序员漫画', description: '程序员职业漫画化（趣味风格）', params: { profession: 'developer', style: 'fun' } },
    { id: 'designer-fun', name: '设计师漫画', description: '设计师职业漫画化（趣味风格）', params: { profession: 'designer', style: 'fun' } },
    { id: 'teacher-fun', name: '教师漫画', description: '教师职业漫画化（趣味风格）', params: { profession: 'teacher', style: 'fun' } },
    { id: 'doctor-professional', name: '医生漫画', description: '医生职业漫画化（专业风格）', params: { profession: 'doctor', style: 'professional' } },
    { id: 'chef-artistic', name: '厨师漫画', description: '厨师职业漫画化（艺术风格）', params: { profession: 'chef', style: 'artistic' } }
  ],
  params: [
    { id: 'profession', name: '职业', type: 'select', default: 'developer', options: [
      { value: 'developer', label: '程序员' },
      { value: 'designer', label: '设计师' },
      { value: 'teacher', label: '教师' },
      { value: 'doctor', label: '医生' },
      { value: 'chef', label: '厨师' },
      { value: 'musician', label: '音乐家' },
      { value: 'writer', label: '作家' },
      { value: 'photographer', label: '摄影师' },
      { value: 'entrepreneur', label: '企业家' },
      { value: 'athlete', label: '运动员' },
      { value: 'artist', label: '艺术家' },
      { value: 'scientist', label: '科学家' }
    ]},
    { id: 'style', name: '风格', type: 'select', default: 'fun', options: [
      { value: 'fun', label: '趣味风格' },
      { value: 'professional', label: '专业风格' },
      { value: 'artistic', label: '艺术风格' }
    ]}
  ]
};
