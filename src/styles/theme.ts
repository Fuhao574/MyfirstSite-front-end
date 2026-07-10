/**
 * 主题配置
 * 统一卡片风格：白底 + 细边框 + 柔和投影
 */

export const theme = {
  colors: {
    // 背景色
    bgPrimary: '#F5F7FA',
    bgSecondary: '#FFFFFF',
    bgTertiary: '#EDF1F7',

    // 文字色
    textPrimary: '#0e1116',
    textSecondary: '#5b6472',
    textTertiary: '#9CA3AF',

    // 强调色
    accentBlue: '#2e7def',
    accentPurple: '#8B5CF6',
    accentPink: '#EC4899',
    accentTeal: '#2bc48a',
    accentOrange: '#ff7a3d',

    // 渐变组合
    gradientBlue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSunset: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    gradientOcean: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    gradientMild: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',

    // 毛玻璃
    glassWhite: 'rgba(255, 255, 255, 0.72)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
  },

  // 阴影
  shadowLight: '0 1px 3px rgba(0, 0, 0, 0.04)',
  shadowMedium: '0 4px 20px rgba(0, 0, 0, 0.06)',
  shadowHeavy: '0 8px 32px rgba(0, 0, 0, 0.08)',

  // 统一卡片样式
  card: {
    bg: '#ffffff',
    border: '1px solid #e3e8ee',
    radius: '28px',
    shadow: '0 1px 1px rgba(14, 17, 22, 0.04), 0 20px 40px -24px rgba(14, 17, 22, 0.18)',
    shadowHover: '0 2px 2px rgba(14, 17, 22, 0.06), 0 28px 48px -24px rgba(14, 17, 22, 0.22)',
    padding: '22px 24px 18px',
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
