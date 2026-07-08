/**
 * Toast 消息提示组件
 * 支持 success / info / warning / error 四种类型
 */

import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const slideDown = keyframes`
  from { opacity: 0; transform: translate(-50%, -20px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
`;

const slideUp = keyframes`
  from { opacity: 1; transform: translate(-50%, 0); }
  to   { opacity: 0; transform: translate(-50%, -20px); }
`;

const ToastContainer = styled.div<{ type: ToastType; exiting: boolean }>`
  position: fixed;
  top: 24px;
  left: 50%;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  border-left: 4px solid;
  font-size: 14px;
  font-weight: 600;
  font-family: "Comic Sans MS", "Chalkboard SE", "Marker Felt", "Gochi Hand", sans-serif;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  animation: ${({ exiting }) => (exiting ? slideUp : slideDown)} 0.3s ease both;
  pointer-events: none;
  white-space: nowrap;

  ${({ type }) => {
    switch (type) {
      case 'success':
        return `
          background-color: #dcfce7;
          border-color: #22c55e;
          color: #14532d;
        `;
      case 'info':
        return `
          background-color: #dbeafe;
          border-color: #3b82f6;
          color: #1e3a8a;
        `;
      case 'warning':
        return `
          background-color: #fef9c3;
          border-color: #eab308;
          color: #713f12;
        `;
      case 'error':
        return `
          background-color: #fee2e2;
          border-color: #ef4444;
          color: #7f1d1d;
        `;
    }
  }}
`;

const IconWrapper = styled.div<{ type: ToastType }>`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }

  ${({ type }) => {
    switch (type) {
      case 'success':
        return 'color: #16a34a;';
      case 'info':
        return 'color: #2563eb;';
      case 'warning':
        return 'color: #ca8a04;';
      case 'error':
        return 'color: #dc2626;';
    }
  }}
`;

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastProps {
  type?: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

/* 各类型对应的图标 SVG */
function ToastIcon({ type }: { type: ToastType }) {
  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6" />
        <path d="M9 9l6 6" />
      </svg>
    ),
  };

  return <IconWrapper type={type}>{icons[type]}</IconWrapper>;
}

export default function Toast({ type = 'info', message, duration = 2500, onClose }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ToastContainer type={type} exiting={exiting}>
      <ToastIcon type={type} />
      <span>{message}</span>
    </ToastContainer>
  );
}
