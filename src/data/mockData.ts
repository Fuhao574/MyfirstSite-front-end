/**
 * Mock 数据 - 个人主页内容
 */

import type { Skill, Project, SocialLink, NavItem } from '../types';

// 导航项
export const navItems: NavItem[] = [
  { id: 'home',     label: '主页',     href: '/home',     icon: 'Home' },
  { id: 'blog',     label: '博客',     href: '/blog',     icon: 'BookOpen' },
  { id: 'projects', label: '项目',     href: '/project',  icon: 'FolderOpen' },
  { id: 'archive',  label: '归档',     href: '/archive',  icon: 'Archive' },
  { id: 'friends',  label: '友链',     href: '/friends',  icon: 'Users' },
  { id: 'about',    label: '关于',     href: '/about',    icon: 'User' },
];

// Hero 区域数据
export const heroData = {
  name: 'Fuhao574',
  avatar: 'https://q2.qlogo.cn/headimg_dl?dst_uin=963155227&spec=0',
};

// 技能数据
export const skillsData: Skill[] = [
  { id: 'react', name: 'React', icon: '⚛️', proficiency: 92, color: '#61DAFB' },
  { id: 'typescript', name: 'TypeScript', icon: '📘', proficiency: 88, color: '#3178C6' },
  { id: 'nodejs', name: 'Node.js', icon: '🟢', proficiency: 85, color: '#339933' },
  { id: 'python', name: 'Python', icon: '🐍', proficiency: 80, color: '#3776AB' },
  { id: 'nextjs', name: 'Next.js', icon: '▲', proficiency: 87, color: '#000000' },
  { id: 'tailwind', name: 'Tailwind CSS', icon: '🎨', proficiency: 90, color: '#06B6D4' },
  { id: 'postgres', name: 'PostgreSQL', icon: '🐘', proficiency: 78, color: '#336791' },
  { id: 'docker', name: 'Docker', icon: '🐳', proficiency: 75, color: '#2496ED' },
  { id: 'graphql', name: 'GraphQL', icon: '◈', proficiency: 82, color: '#E10098' },
  { id: 'aws', name: 'AWS', icon: '☁️', proficiency: 70, color: '#FF9900' },
];

// 项目数据（保留类型定义兼容，当前未使用）
export const projectsData: Project[] = [
  {
    id: '1',
    title: '智能记账助手',
    description: '基于 AI 的消费分析与智能记账应用，支持语音录入和自动分类。',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    tags: ['React Native', 'TensorFlow.js', 'Node.js'],
    link: '#',
  },
  {
    id: '2',
    title: '协作文档平台',
    description: '实时协作的在线文档编辑器，支持多人同时编辑与版本控制。',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    tags: ['Next.js', 'WebSocket', 'PostgreSQL'],
    link: '#',
  },
  {
    id: '3',
    title: '数据可视化大屏',
    description: '企业级数据可视化仪表盘，支持实时数据流与自定义图表。',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    tags: ['D3.js', 'Vue 3', 'FastAPI'],
    link: '#',
  },
  {
    id: '4',
    title: '电商小程序',
    description: '全功能电商平台小程序，包含商品、订单、支付、物流追踪。',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
    tags: ['Taro', 'TypeScript', 'Go'],
    link: '#',
  },
];

// 社交链接（保留类型定义兼容，当前未使用）
export const socialLinks: SocialLink[] = [
  { id: 'github', name: 'GitHub', url: 'https://github.com', icon: 'github' },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { id: 'email', name: 'Email', url: 'mailto:alex@example.com', icon: 'mail' },
];
