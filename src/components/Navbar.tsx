/**
 * 顶部导航栏组件
 * 左侧 Logo / 名字缩写，右侧导航链接
 * 支持平滑滚动锚点 + 毛玻璃效果
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { navItems } from '../data/mockData';
import { theme } from '../styles/theme';
import { Menu, X } from 'lucide-react';

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

const NavLinks = styled.ul<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};
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
        AC
      </Logo>

      <NavLinks isOpen={isMenuOpen}>
        {navItems.map((item) => (
          <li key={item.id}>
            <NavLink href={item.href} onClick={(e) => handleNavClick(e, item.href)}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </NavLinks>

      <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="菜单">
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </MenuButton>
    </NavContainer>
  );
}
