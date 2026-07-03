/**
 * 顶部导航栏组件
 * 左侧 Logo / 名字缩写，右侧导航链接 + iCost 风格按钮组
 * 支持平滑滚动锚点 + 毛玻璃效果
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { navItems } from '../data/mockData';
import { theme } from '../styles/theme';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';

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

  /* 毛玻璃效果 */
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

const Logo = styled.a`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &::before {
    content: '';
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: ${theme.borderRadius.md};
    background: ${theme.colors.gradientBlue};
    opacity: 0.85;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

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
   iCost 风格按钮组 - 带背景容器
   ============================================ */
const ButtonPanel = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  /* iOS 控制中心风格的背景容器 */
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

  /* 纯色背景 - iCost 风格 */
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

  /* iCost 风格柔和阴影 */
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

  /* 点击时的波纹效果 */
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

export default function Navbar() {
  const { isScrolled } = useScrollPosition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <NavContainer isScrolled={isScrolled}>
      <Logo href="#" onClick={(e) => handleNavClick(e, '#')}>
        FH
      </Logo>

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

        {/* iCost 风格按钮组 - 带毛玻璃背景容器 */}
        <ButtonPanel>
          {/* 主题切换 - 蓝色 */}
          <IconButton
            variant="blue"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? '切换亮色模式' : '切换暗色模式'}
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>

          {/* 语言切换 - 青色 */}
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
