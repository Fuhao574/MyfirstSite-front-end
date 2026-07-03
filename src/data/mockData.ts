/**
 * Mock 数据 - 个人主页内容
 */

import type { Skill, Project, SocialLink, NavItem } from '../types';

// 导航项
export const navItems: NavItem[] = [
  { id: 'about', label: '关于', href: '#about' },
  { id: 'skills', label: '技能', href: '#skills' },
  { id: 'projects', label: '项目', href: '#projects' },
  { id: 'contact', label: '联系', href: '#contact' },
];

// Hero 区域数据
export const heroData = {
  name: 'Alex Chen',
  title: '全栈开发者',
  tagline: '用代码构建优雅体验，让技术温暖生活',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
};

// 关于我
export const aboutData = {
  title: '关于我',
  description:
    '我是一名热爱创造的全栈开发者，拥有 5 年的 Web 和移动端开发经验。专注于构建高性能、可访问且视觉精致的应用程序。我相信好的代码不仅要能运行，更要优雅易读。在工作之余，我喜欢探索新技术、撰写技术博客，以及参与开源社区。',
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
  highlights: [
    { icon: '💻', label: '5年开发经验' },
    { icon: '🚀', label: '20+ 上线项目' },
    { icon: '📚', label: '技术博客作者' },
    { icon: '🌍', label: '开源贡献者' },
  ],
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

// 项目数据
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

// 社交链接
export const socialLinks: SocialLink[] = [
  { id: 'github', name: 'GitHub', url: 'https://github.com', icon: 'github' },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { id: 'email', name: 'Email', url: 'mailto:alex@example.com', icon: 'mail' },
];
