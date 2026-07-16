/**
 * Toast 消息提示组件 — 通知样式
 * 纯色背景 + 进度条 + 关闭按钮
 * 支持 success / info / warning / error 四种类型
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

/* ============================================
   类型配置
   ============================================ */
const TYPE_CONFIG: Record<ToastType, {
  color: string;
  bg: string;
  hoverBg: string;
  progressBarBg: string;
  iconPath: string;
}> = {
  success: {
    color: '#047857',
    bg: '#d1fae5',
    hoverBg: '#a7f3d0',
    progressBarBg: '#047857',
    iconPath: 'M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  info: {
    color: '#1e3a8a',
    bg: '#dbeafe',
    hoverBg: '#bfdbfe',
    progressBarBg: '#1e3a8a',
    iconPath: 'M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  warning: {
    color: '#78350f',
    bg: '#fef3c7',
    hoverBg: '#fde68a',
    progressBarBg: '#78350f',
    iconPath: 'M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  error: {
    color: '#7f1d1d',
    bg: '#fee2e2',
    hoverBg: '#fecaca',
    progressBarBg: '#7f1d1d',
    iconPath: 'm15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
};

/* ============================================
   动画
   ============================================ */
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const progressBar = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-100%); }
`;

/* ============================================
   通知容器（ul — 通过 Portal 渲染到 document.body）
   ============================================ */
const StyledContainer = styled.ul`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style-type: none;
  font-family: sans-serif;
  font-size: 14px;
  pointer-events: none;
  margin: 0;
  padding: 0;
`;

/* ============================================
   通知项（li）
   ============================================ */
const StyledItem = styled.li<{ type: ToastType }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 0.75em;
  overflow: hidden;
  padding: 7px 12px;
  border-radius: 6px;
  box-shadow: rgba(111, 111, 111, 0.2) 0px 8px 24px;
  transition: all 250ms ease;
  pointer-events: auto;

  color: ${({ type }) => TYPE_CONFIG[type].color};
  background-color: ${({ type }) => TYPE_CONFIG[type].bg};
  animation: ${slideIn} 0.4s ease both;

  &:hover {
    transform: scale(1.01);
    background-color: ${({ type }) => TYPE_CONFIG[type].hoverBg};
  }

  &:active {
    transform: scale(1.05);
  }

  svg {
    transition: 250ms ease;
  }
`;

/* ============================================
   内容区（图标 + 文字）
   ============================================ */
const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5em;
`;

/* ============================================
   图标
   ============================================ */
const IconWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 1em;
    height: 1em;
    color: inherit;
  }
`;

/* ============================================
   关闭按钮
   ============================================ */
const CloseButton = styled.div`
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 250ms;

  svg {
    width: 1em;
    height: 1em;
    color: inherit;
  }

  &:hover {
    background-color: rgba(204, 204, 204, 0.45);

    svg {
      color: rgb(0, 0, 0);
    }
  }

  &:active svg {
    transform: scale(1.1);
  }
`;

/* ============================================
   文字
   ============================================ */
const Text = styled.div`
  font-size: 0.85em;
  user-select: none;
`;

/* ============================================
   进度条
   ============================================ */
const ProgressBar = styled.div<{ type: ToastType; duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: ${({ type }) => TYPE_CONFIG[type].progressBarBg};
  animation: ${progressBar} ${({ duration }) => duration}ms linear forwards;
`;

/* ============================================
   关闭图标 SVG
   ============================================ */
const CloseIcon = () => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18 17.94 6M18 18 6.06 6"
    />
  </svg>
);

/* ============================================
   NotificationItem — 单条通知
   ============================================ */
interface NotificationItemProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

export function NotificationItem({ type, message, duration = 3000, onClose }: NotificationItemProps) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const config = TYPE_CONFIG[type];

  return (
    <StyledItem type={type}>
      <Content>
        <IconWrapper>
          <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={config.iconPath}
            />
          </svg>
        </IconWrapper>
        <Text>{message}</Text>
      </Content>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <ProgressBar type={type} duration={duration} />
    </StyledItem>
  );
}

/* ============================================
   NotificationContainer — 通知容器（Portal）
   ============================================ */
export function NotificationContainer({ children }: { children: ReactNode }) {
  return createPortal(
    <StyledContainer>{children}</StyledContainer>,
    document.body
  );
}

/* ============================================
   默认导出（向后兼容）
   ============================================ */
export default function Toast({ type = 'info', message, duration = 3000, onClose }: NotificationItemProps) {
  return (
    <NotificationContainer>
      <NotificationItem type={type} message={message} duration={duration} onClose={onClose} />
    </NotificationContainer>
  );
}
