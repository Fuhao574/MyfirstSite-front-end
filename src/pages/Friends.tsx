/**
 * 友链 - 左侧内容
 * 右侧栏由 Layout 统一提供
 */

import styled from '@emotion/styled';
import { theme } from '../styles/theme';

const EmptyState = styled.div`
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

export default function Friends() {
  return (
    <EmptyState>
      <h2>友链</h2>
      <p>页面建设中...</p>
    </EmptyState>
  );
}
