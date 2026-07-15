/**
 * UserTooltip — 用户信息提示框
 * 点击已登录头像时展示，显示重新登录提示 + 访客类型
 */

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const tipFadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: -25px;
  margin-top: 8px;
  max-width: 200px;
  width: max-content;
  padding: 10px 14px;
  background: #ffffff;
  border: 1px solid #e3e8ee;
  border-radius: 14px;
  box-shadow:
    0 1px 1px rgba(14, 17, 22, 0.04),
    0 18px 36px -22px rgba(14, 17, 22, 0.22),
    0 2px 6px rgba(14, 17, 22, 0.06);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  font-size: 13px;
  color: #0e1116;
  z-index: 100;
  pointer-events: none;
  animation: ${tipFadeIn} 0.2s ease both;

  &::after {
    content: '';
    position: absolute;
    left: 38px;
    top: -6px;
    width: 12px;
    height: 12px;
    background: #ffffff;
    border-top: 1px solid #e3e8ee;
    border-left: 1px solid #e3e8ee;
    transform: rotate(45deg);
  }
`;

const TipTitle = styled.p`
  margin: 0 0 6px;
  font-size: 11.5px;
  font-weight: 500;
  color: #5b6472;
  letter-spacing: 0.01em;
  white-space: nowrap;
`;

const TipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const TipLabel = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ color }) => color};

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }
`;

interface UserTooltipProps {
  mode: 'visitor' | 'friend';
  username: string;
}

export default function UserTooltip({ mode }: UserTooltipProps) {
  const modeColor = mode === 'friend' ? '#2e7def' : '#2bc48a';
  const modeText = mode === 'friend' ? 'Friend' : 'Visitor';

  return (
    <TooltipWrapper>
      <TipTitle>再次点击头像进入个人中心哦~</TipTitle>
      <TipRow>
        <TipLabel color={modeColor}>{modeText}</TipLabel>
      </TipRow>
    </TooltipWrapper>
  );
}
