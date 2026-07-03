/**
 * 主题配置 - iCost / iOS 风格设计系统
 * 低饱和度、柔和、毛玻璃、圆角
 */

export const theme = {
  colors: {
    // 背景色
    bgPrimary: '#F5F7FA',
    bgSecondary: '#FFFFFF',
    bgTertiary: '#EDF1F7',

    // 文字色
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',

    // 强调色 - 低饱和度渐变
    accentBlue: '#6366F1',
    accentPurple: '#8B5CF6',
    accentPink: '#EC4899',
    accentTeal: '#14B8A6',
    accentOrange: '#F97316',

    // 渐变组合
    gradientBlue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSunset: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    gradientOcean: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    gradientMild: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',

    // 毛玻璃
    glassWhite: 'rgba(255, 255, 255, 0.72)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',

    // 阴影
    shadowLight: '0 1px 3px rgba(0, 0, 0, 0.04)',
    shadowMedium: '0 4px 20px rgba(0, 0, 0, 0.06)',
    shadowHeavy: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },

  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    full: '9999px',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
  },

  typography: {
    h1: 'font-size: 48px; font-weight: 700; line-height: 1.2;',
    h2: 'font-size: 36px; font-weight: 600; line-height: 1.3;',
    h3: 'font-size: 24px; font-weight: 600; line-height: 1.4;',
    body: 'font-size: 16px; font-weight: 400; line-height: 1.6;',
    caption: 'font-size: 14px; font-weight: 400; line-height: 1.5;',
    small: 'font-size: 12px; font-weight: 400; line-height: 1.4;',
  },

  transitions: {
    default: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    fast: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    slow: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
  },

  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
} as const;

export type Theme = typeof theme;
