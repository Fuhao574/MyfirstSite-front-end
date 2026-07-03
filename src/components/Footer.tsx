/**
 * 页脚组件
 * 版权信息 + 返回顶部按钮
 */

import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { ArrowUp } from 'lucide-react';

const FooterSection = styled.footer`
  padding: ${theme.spacing['2xl']} ${theme.spacing.xl};
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  background: ${theme.colors.bgSecondary};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

const Copyright = styled.p`
  font-size: 14px;
  color: ${theme.colors.textTertiary};

  a {
    color: ${theme.colors.textSecondary};
    font-weight: 500;

    &:hover {
      color: ${theme.colors.accentBlue};
    }
  }
`;

const BackToTop = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.bgPrimary};
  color: ${theme.colors.textSecondary};
  box-shadow: ${theme.shadowLight};
  transition: ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.accentBlue};
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <FooterSection>
      <FooterContent>
        <Copyright>
          &copy; {currentYear} Fuhao574. 使用 React + TypeScript 构建。
        </Copyright>
        <BackToTop onClick={handleBackToTop} aria-label="返回顶部">
          <ArrowUp size={20} />
        </BackToTop>
      </FooterContent>
    </FooterSection>
  );
}
