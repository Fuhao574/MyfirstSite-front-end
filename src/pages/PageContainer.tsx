/**
 * 通用页面容器样式
 */

import styled from '@emotion/styled';
import { theme } from '../styles/theme';

export const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 72px;
  background: linear-gradient(
    135deg,
    #eef2ff 0%,
    #f5f7fa 30%,
    #f5f3ff 60%,
    #eef2ff 100%
  );
  background-size: 200% 200%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding-top: 64px;
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing['4xl']} ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.md};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: ${theme.colors.textSecondary};
  text-align: center;

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: ${theme.colors.textPrimary};
    margin-bottom: ${theme.spacing.md};
  }

  p {
    font-size: 16px;
    color: ${theme.colors.textTertiary};
  }
`;
