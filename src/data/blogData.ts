/**
 * 博客文章数据
 */

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  cover?: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'hello-world',
    title: 'Hello World — 我的第一个个人主页',
    excerpt: '从零开始搭建一个现代化的个人主页，记录技术选型、设计思路与开发过程中的那些坑。',
    date: '2026-07-14',
    category: '技术随笔',
    tags: ['React', 'TypeScript', 'Vite', 'Styled Components'],
    readTime: 8,
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    content: `## 缘起

一直想拥有一个属于自己的个人主页，不仅能展示项目经历，还能写写博客、记录生活。经过两周的断断续续开发，终于把第一版上线了。

## 技术选型

| 技术 | 选择 | 理由 |
|------|------|------|
| 框架 | React 18 | 生态成熟，团队熟悉 |
| 语言 | TypeScript | 类型安全，开发体验好 |
| 构建 | Vite | 极速 HMR，开箱即用 |
| 样式 | Emotion Styled | CSS-in-JS，灵活可控 |
| 路由 | React Router v6 | 嵌套路由，Layout 模式 |

## 设计思路

整体风格参考了 iOS 的设计语言：圆角卡片、柔和阴影、大量留白。背景使用渐变色而非纯色，让页面更有层次感。

### 双栏布局

采用 \`grid-template-columns: 1fr 340px\` 实现双栏：
- **左侧**：页面主体内容，随路由切换
- **右侧**：ProfileCard + CalendarCard，全站共享，不随页面切换而变化

移动端自动折叠为单列，保证移动端体验。

### 动画细节

- 卡片入场动画使用 \`cubic-bezier(0.25, 0.1, 0.25, 1.0)\` 缓动函数
- 骨架屏用 \`shimmer\` 动画占位，避免内容跳动
- 登录卡片使用 3D 翻转效果（Visitor / Friend 双面）

## 踩过的坑

### 1. backface-visibility 与 z-index 冲突

3D 翻转卡片中，如果给子元素设置 \`z-index\`，会创建新的层叠上下文，导致 \`backface-visibility: hidden\` 失效，两个面同时可见。解决方案：去掉 \`z-index\`，给 CloseButton 也加上 \`backface-visibility: hidden\`。

### 2. Google Fonts 国内访问慢

最初通过 \`<link>\` 引入 Google Fonts，国内访问极不稳定。最终改用 \`@fontsource\` npm 包，字体文件本地化，零外网请求。

### 3. overscroll 白色背景

macOS 触控板过度滚动时，会露出 \`html\` / \`body\` 的默认白色背景。解决方案：给 \`html\` 和 \`body\` 设置与页面渐变基础色一致的 \`background-color: #eef2ff\`。

## 总结

这个项目虽然不大，但涉及了前端开发的方方面面：路由、布局、动画、状态管理、响应式设计。最重要的是，它是我自己的一个小天地，可以随心所欲地折腾。

下一阶段计划：
- 接入 Markdown 渲染，支持真正的博客文章
- 添加暗色模式
- 优化 SEO

> 「The best way to predict the future is to invent it.」 — Alan Kay`,
  },
];
