/**
 * 回到顶部按钮
 * 滚动时出现在右下角，点击回到页面顶部
 */

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const Button = styled.button<{ visible: boolean }>`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgb(20, 20, 20);
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 0px 4px rgba(180, 160, 255, 0.253);
  cursor: pointer;
  transition: all 0.3s ease, opacity 0.4s ease, transform 0.4s ease;
  overflow: hidden;
  z-index: 999;

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};

  &:hover {
    width: 140px;
    border-radius: 50px;
    background-color: rgb(181, 160, 255);
    align-items: center;
  }

  &::before {
    position: absolute;
    bottom: -20px;
    content: 'Back to Top';
    color: white;
    font-size: 0px;
    opacity: 0;
    white-space: nowrap;
  }

  &:hover::before {
    font-size: 13px;
    opacity: 1;
    bottom: unset;
    transition-duration: 0.3s;
  }

  &:hover .svg-icon {
    transition-duration: 0.3s;
    transform: translateY(-200%);
  }
`;

const SvgIcon = styled.svg`
  width: 12px;
  transition-duration: 0.3s;

  path {
    fill: white;
  }
`;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button visible={visible} onClick={scrollToTop} aria-label="Back to Top">
      <SvgIcon
        className="svg-icon"
        viewBox="0 0 384 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
      </SvgIcon>
    </Button>
  );
}
