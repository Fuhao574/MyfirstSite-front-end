/**
 * 全局类型定义
 */

export interface Skill {
  id: string;
  name: string;
  icon: string;
  proficiency: number; // 0-100
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}
