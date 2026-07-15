/**
 * 顶部导航栏组件
 * 左侧小头像，中间新拟态（Neumorphism）导航，右侧按钮组
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { navItems } from '../data/mockData';
import { theme } from '../styles/theme';
import {
  Menu, X, Sun, Moon, Globe,
  Home, BookOpen, Archive, Users, FolderOpen, User,
} from 'lucide-react';
import LoginCard, { type LoginResult } from './LoginCard';
import UserTooltip from './UserTooltip';
import ProfileCenter from './ProfileCenter';

/* Navbar Toast 样式 */
const navToastIn = keyframes`
  from { opacity: 0; transform: translateY(-100%); }
  to   { opacity: 1; transform: translateY(0); }
`;

const NAV_TOAST_STYLES: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  success: { bg: '#dcfce7', border: '#22c55e', color: '#166534', icon: '#16a34a' },
  info:    { bg: '#dbeafe', border: '#3b82f6', color: '#1e40af', icon: '#2563eb' },
  warning: { bg: '#fef9c3', border: '#eab308', color: '#854d0e', icon: '#ca8a04' },
  error:   { bg: '#fee2e2', border: '#ef4444', color: '#991b1b', icon: '#dc2626' },
};

const NavToastContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
`;

const NavToastMessage = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ type }) => NAV_TOAST_STYLES[type]?.bg || NAV_TOAST_STYLES.info.bg};
  border-left: 4px solid ${({ type }) => NAV_TOAST_STYLES[type]?.border || NAV_TOAST_STYLES.info.border};
  border-radius: 8px;
  color: ${({ type }) => NAV_TOAST_STYLES[type]?.color || NAV_TOAST_STYLES.info.color};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  animation: ${navToastIn} 0.4s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: ${({ type }) => NAV_TOAST_STYLES[type]?.icon || NAV_TOAST_STYLES.info.icon};
  }
`;

/* 动画 */
const scaleIn = keyframes`
  from { transform: scale(1.6); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0) rotate(0deg); }
  10% { transform: translateX(-3px) rotate(-2deg); }
  20% { transform: translateX(3px) rotate(2deg); }
  30% { transform: translateX(-3px) rotate(-1deg); }
  40% { transform: translateX(3px) rotate(1deg); }
  50% { transform: translateX(-2px) rotate(0deg); }
  60% { transform: translateX(2px) rotate(0deg); }
  70% { transform: translateX(-1px) rotate(0deg); }
  80% { transform: translateX(1px) rotate(0deg); }
`;

const selectPop = keyframes`
  0%   { transform: scale(0.95); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const particleTop = keyframes`
  0%   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  40%  { opacity: 0.8; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-18px) scale(0); }
`;

const particleBottom = keyframes`
  0%   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  40%  { opacity: 0.8; }
  100% { opacity: 0; transform: translateX(-50%) translateY(18px) scale(0); }
`;

const ripple = keyframes`
  0%   { opacity: 0.6; transform: scale(0.3); }
  100% { opacity: 0;   transform: scale(2.2); }
`;

/* ============================================
   导航栏
   ============================================ */
const NavContainer = styled.nav<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  width: 100%;

  background: ${({ isScrolled }) =>
    isScrolled ? 'rgba(245, 247, 250, 0.8)' : 'transparent'};
  backdrop-filter: ${({ isScrolled }) => (isScrolled ? 'blur(20px) saturate(180%)' : 'none')};
  -webkit-backdrop-filter: ${({ isScrolled }) =>
    isScrolled ? 'blur(20px) saturate(180%)' : 'none'};
  border-bottom: ${({ isScrolled }) =>
    isScrolled ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid transparent'};

  transition: ${theme.transitions.default};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.md};
    height: 64px;
  }
`;

/* ============================================
   小头像区域
   ============================================ */
const LogoAvatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: ${theme.borderRadius.md};
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;

  &.initial {
    animation: ${scaleIn} 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  }

  &.shaking {
    animation: ${shake} 0.5s ease-in-out !important;
  }
`;

const AvatarArea = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const AvatarInner = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SiteTitle = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.5px;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 15px;
    max-width: 90px;
  }
`;

/* ============================================
   新拟态导航菜单（桌面端）
   ============================================ */
const NeoMenu = styled.ul`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  list-style: none;
  padding: 6px;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NeoLink = styled(Link)<{ active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 0.7rem;
  padding: 12px;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.2s ease, box-shadow 0.2s ease, color 0.15s ease;

  color: ${({ active }) => (active ? '#ffffff' : '#2d3748')};
  background: ${({ active }) =>
    active ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'transparent'};
  box-shadow: ${({ active }) =>
    active
      ? 'inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.1), 3px 3px 8px rgba(59,130,246,0.3)'
      : 'none'};

  ${({ active }) =>
    active &&
    css`
      animation: ${selectPop} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `}

  /* 悬停特效（active 时不动，避免和回弹动画冲突） */
  &:hover {
    color: ${({ active }) => (active ? '#ffffff' : theme.colors.accentBlue)};
    background: ${({ active }) =>
      active ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(99, 102, 241, 0.06)'};
    box-shadow: ${({ active }) =>
      active
        ? 'inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.1), 3px 3px 8px rgba(59,130,246,0.3)'
        : '0 4px 12px rgba(99, 102, 241, 0.15)'};
    ${({ active }) =>
      !active &&
      css`
        transform: translateY(-2px);
      `}
  }

  /* 涟漪 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.4) 0%,
      transparent 60%
    );
    opacity: 0;
    transform: scale(0.3);
  }

  ${({ active }) =>
    active &&
    css`
      &::before {
        animation: ${ripple} 0.8s ease-out;
      }
    `}

  /* 上粒子 */
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #60a5fa;
    box-shadow: 0 0 6px #60a5fa;
    opacity: 0;
    transform: translateX(-50%);
  }

  ${({ active }) =>
    active &&
    css`
      &::after {
        animation: ${particleTop} 0.8s ease-out forwards;
      }
    `}

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }
`;

/* 下粒子（单独元素避免伪元素冲突） */
const ParticleBot = styled.span<{ active?: boolean }>`
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #93c5fd;
  box-shadow: 0 0 6px #93c5fd;
  opacity: 0;
  transform: translateX(-50%);
  pointer-events: none;

  ${({ active }) =>
    active &&
    css`
      animation: ${particleBottom} 0.8s ease-out forwards;
    `}
`;

/* ============================================
   移动端导航
   ============================================ */
const MobileNavLinks = styled.ul<{ isOpen: boolean }>`
  display: none;
  list-style: none;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: ${theme.spacing['3xl']};
    gap: 32px;
    background: rgba(245, 247, 250, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transition: ${theme.transitions.default};
    pointer-events: ${({ isOpen }) => (isOpen ? 'all' : 'none')};
  }
`;

const MobileNavLink = styled(Link)`
  font-size: 18px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: ${theme.colors.accentBlue};
    background: rgba(99, 102, 241, 0.06);
  }
`;

/* ============================================
   右侧按钮组
   ============================================ */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-left: auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: ${theme.spacing.sm};
  }
`;

const ButtonPanel = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: ${theme.borderRadius.xl};
  padding: 5px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const IconButton = styled.button<{ variant?: 'blue' | 'yellow' | 'teal' }>`
  width: 38px;
  height: 38px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: ${theme.transitions.fast};
  position: relative;
  overflow: hidden;

  background: ${({ variant }) => {
    switch (variant) {
      case 'yellow':
        return 'linear-gradient(135deg, #FFB800 0%, #FF9500 100%)';
      case 'teal':
        return 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)';
      case 'blue':
      default:
        return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
    }
  }};

  box-shadow: ${({ variant }) => {
    switch (variant) {
      case 'yellow':
        return '0 2px 8px rgba(255, 184, 0, 0.35)';
      case 'teal':
        return '0 2px 8px rgba(20, 184, 166, 0.35)';
      case 'blue':
      default:
        return '0 2px 8px rgba(59, 130, 246, 0.35)';
    }
  }};

  &:hover {
    transform: translateY(-1px) scale(1.06);
    box-shadow: ${({ variant }) => {
      switch (variant) {
        case 'yellow':
          return '0 4px 14px rgba(255, 184, 0, 0.45)';
        case 'teal':
          return '0 4px 14px rgba(20, 184, 166, 0.45)';
        case 'blue':
        default:
          return '0 4px 14px rgba(59, 130, 246, 0.45)';
      }
    }};
  }

  &:active {
    transform: scale(0.94);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(255, 255, 255, 0.2);
    opacity: 0;
    transition: opacity 0.2s ease-out;
  }

  &:active::after {
    opacity: 1;
  }

  svg {
    width: 17px;
    height: 17px;
    stroke-width: 2.5;
  }
`;

const MenuButton = styled.button`
  display: none;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.textPrimary};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* 图标映射 */
function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'Home': return <Home />;
    case 'BookOpen': return <BookOpen />;
    case 'Archive': return <Archive />;
    case 'Users': return <Users />;
    case 'FolderOpen': return <FolderOpen />;
    case 'User': return <User />;
    default: return <Home />;
  }
}

export default function Navbar() {
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [initial, setInitial] = useState(true);
  const [loginCardOpen, setLoginCardOpen] = useState(false);
  const [loginResult, setLoginResult] = useState<LoginResult | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [profileCenterOpen, setProfileCenterOpen] = useState(false);
  const [navToasts, setNavToasts] = useState<{ id: number; msg: string; type: 'success' | 'info' | 'warning' | 'error' }[]>([]);
  const navToastIdRef = useRef(0);
  const avatarAreaRef = useRef<HTMLDivElement>(null);

  // Navbar 级 Toast（ProfileCenter 关闭后继续显示）
  const showNavToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = ++navToastIdRef.current;
    setNavToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setNavToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // 根据当前路由判断激活的导航项（支持子路由，如 /blog/:postId 高亮"博客"）
  const activeNav = navItems.find(item =>
    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
  )?.id || 'home';

  useEffect(() => {
    const timer = setTimeout(() => setInitial(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // 点击空白处关闭 tooltip + 3秒自动关闭
  useEffect(() => {
    if (!tooltipOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarAreaRef.current && !avatarAreaRef.current.contains(e.target as Node)) {
        setTooltipOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    const autoClose = setTimeout(() => setTooltipOpen(false), 3000);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(autoClose);
    };
  }, [tooltipOpen]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShaking(false);
    requestAnimationFrame(() => setShaking(true));
    setTimeout(() => setShaking(false), 500);

    if (!loginResult) {
      // 未登录 → 打开登录卡片
      setLoginCardOpen(true);
    } else if (profileCenterOpen) {
      // 个人中心已打开 → 不做额外操作
      return;
    } else if (tooltipOpen) {
      // tooltip 可见 → 关闭 tooltip，打开个人中心
      setTooltipOpen(false);
      setProfileCenterOpen(true);
    } else {
      // 已登录但 tooltip 不可见 → 显示 tooltip
      setTooltipOpen(true);
    }
  };

  const handleLoginSuccess = (result: LoginResult) => {
    setLoginResult(result);
    setLoginCardOpen(false);
  };

  const handleProfileUpdate = (result: LoginResult) => {
    setLoginResult(result);
  };

  const handleLogout = () => {
    setLoginResult(null);
    setProfileCenterOpen(false);
    setTooltipOpen(false);
  };

  const avatarSrc = loginResult?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=guest&backgroundColor=eef2ff';
  const displayName = loginResult?.username || '';

  return (
    <NavContainer isScrolled={isScrolled}>
      <AvatarArea ref={avatarAreaRef} onClick={handleAvatarClick}>
        <AvatarInner>
          <LogoAvatar
            src={avatarSrc}
            alt="avatar"
            className={`${initial ? 'initial' : ''} ${shaking ? 'shaking' : ''}`}
          />
          <SiteTitle>{displayName}</SiteTitle>
        </AvatarInner>
        {tooltipOpen && loginResult && (
          <UserTooltip mode={loginResult.mode} username={loginResult.username || '未设置'} />
        )}
      </AvatarArea>

      {/* 新拟态导航（桌面端） */}
      <NeoMenu>
        {navItems.map((item) => (
          <li key={item.id} style={{ position: 'relative' }}>
            <NeoLink
              to={item.href}
              active={activeNav === item.id}
              onClick={() => handleNavClick()}
            >
              <NavIcon icon={item.icon} />
              {item.label}
            </NeoLink>
            <ParticleBot active={activeNav === item.id} />
          </li>
        ))}
      </NeoMenu>

      {/* 移动端导航 */}
      <MobileNavLinks isOpen={isMenuOpen}>
        {navItems.map((item) => (
          <li key={item.id}>
            <MobileNavLink to={item.href} onClick={() => handleNavClick()}>
              <NavIcon icon={item.icon} />
              {item.label}
            </MobileNavLink>
          </li>
        ))}
      </MobileNavLinks>

      <RightSection>
        <ButtonPanel>
          <IconButton
            variant="blue"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? '切换亮色模式' : '切换暗色模式'}
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>

          <IconButton variant="teal" aria-label="切换语言">
            <Globe size={17} />
          </IconButton>
        </ButtonPanel>

        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="菜单">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MenuButton>
      </RightSection>

      {loginCardOpen && (
        <LoginCard
          onClose={() => setLoginCardOpen(false)}
          onSuccess={handleLoginSuccess}
          initial={loginResult}
        />
      )}

      {profileCenterOpen && loginResult && (
        <ProfileCenter
          loginResult={loginResult}
          onClose={() => setProfileCenterOpen(false)}
          onUpdate={handleProfileUpdate}
          onLogout={handleLogout}
          onToast={showNavToast}
        />
      )}

      {/* Navbar 级 Toast（ProfileCenter 关闭后继续显示） */}
      {navToasts.length > 0 && createPortal(
        <NavToastContainer>
          {navToasts.map((t) => (
            <NavToastMessage key={t.id} type={t.type}>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              {t.msg}
            </NavToastMessage>
          ))}
        </NavToastContainer>,
        document.body
      )}
    </NavContainer>
  );
}
