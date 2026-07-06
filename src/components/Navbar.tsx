/**
 * 顶部导航栏组件
 * 左侧小头像（悬停抖动+状态卡片），右侧 iCost 风格按钮组
 */

import { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { navItems } from '../data/mockData';
import { theme } from '../styles/theme';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';

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
  padding: 0 ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
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
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.15);
  }
`;

/* 状态卡片 - 点击弹出，鼠标移开关闭 */
const StatusCard = styled.div<{ show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  white-space: nowrap;
  z-index: 10;
  opacity: ${({ show }) => (show ? 1 : 0)};
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  transform: ${({ show }) => (show ? 'translateY(0)' : 'translateY(8px)')};
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1.0);

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 16px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid ${theme.colors.bgSecondary};
  }
`;

const StatusEmoji = styled.span`
  font-size: 24px;
  line-height: 1;
`;

const StatusText = styled.span<{ color: string }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

const StatusLabel = styled.span`
  font-size: 11px;
  color: ${theme.colors.textTertiary};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-left: auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: ${theme.spacing.sm};
  }
`;

const NavLinks = styled.ul<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  list-style: none;

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: ${theme.spacing['3xl']};
    gap: ${theme.spacing.xl};
    background: rgba(245, 247, 250, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transition: ${theme.transitions.default};
    pointer-events: ${({ isOpen }) => (isOpen ? 'all' : 'none')};
  }
`;

const NavLink = styled.a`
  font-size: 15px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: ${theme.transitions.fast};
  position: relative;

  &:hover {
    color: ${theme.colors.accentBlue};
    background: rgba(99, 102, 241, 0.06);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 18px;
  }
`;

/* ============================================
   iCost 风格按钮组
   ============================================ */
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

/* 工作状态 */
function useWorkStatus() {
  const [status, setStatus] = useState({ text: '加载中...', emoji: '⏳', color: '#9CA3AF' });

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    const isWeekday = day >= 1 && day <= 5;
    const isWorkHour = hour >= 9 && hour < 18;

    if (isWeekday && isWorkHour) {
      setStatus({ text: '摸鱼中', emoji: '🐟', color: '#3B82F6' });
    } else if (isWeekday && !isWorkHour) {
      setStatus({ text: 'Happy中', emoji: '🎮', color: '#8B5CF6' });
    } else {
      setStatus({ text: '享受周末', emoji: '🎉', color: '#F97316' });
    }
  }, []);

  return status;
}

export default function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [statusCardOpen, setStatusCardOpen] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [initial, setInitial] = useState(true);
  const workStatus = useWorkStatus();

  useEffect(() => {
    const timer = setTimeout(() => setInitial(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShaking(false);
    requestAnimationFrame(() => {
      setShaking(true);
      setStatusCardOpen(true);
    });
    setTimeout(() => setShaking(false), 500);
  };

  const handleAvatarLeave = () => {
    setStatusCardOpen(false);
  };

  return (
    <NavContainer isScrolled={isScrolled}>
      <AvatarArea onClick={handleAvatarClick} onMouseLeave={handleAvatarLeave}>
        <LogoAvatar
          src="https://q2.qlogo.cn/headimg_dl?dst_uin=963155227&spec=0" 
          alt="avatar"
          className={`${initial ? 'initial' : ''} ${shaking ? 'shaking' : ''}`}
        />
        <StatusCard show={statusCardOpen}>
          <StatusEmoji>{workStatus.emoji}</StatusEmoji>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <StatusText color={workStatus.color}>{workStatus.text}</StatusText>
            <StatusLabel>当前状态</StatusLabel>
          </div>
        </StatusCard>
      </AvatarArea>

      <RightSection>
        <NavLinks isOpen={isMenuOpen}>
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink href={item.href} onClick={(e) => handleNavClick(e, item.href)}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </NavLinks>

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
    </NavContainer>
  );
}