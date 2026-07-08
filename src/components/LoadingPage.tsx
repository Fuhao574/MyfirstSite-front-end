/**
 * LoadingPage — 涂鸦风格加载页面
 * 展示加载动画，3.5s 后自动进入主站
 */

import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

/* 浮动动画 */
const dlFloatA = keyframes`
  0%, 100% { transform: translateY(0) rotate(-8deg); }
  50%      { transform: translateY(-0.8em) rotate(6deg); }
`;

const dlFloatB = keyframes`
  0%, 100% { transform: translateY(0) rotate(6deg); }
  50%      { transform: translateY(-0.7em) rotate(-8deg); }
`;

const dlWrite = keyframes`
  0%, 100% { transform: rotate(-18deg) translateY(0); }
  50%      { transform: rotate(-4deg) translateY(0.5em); }
`;

const dlUnderline = keyframes`
  0%, 14%     { opacity: 0; transform: scaleX(0); }
  24%, 88%    { opacity: 1; transform: scaleX(1); }
  97%, 100%   { opacity: 0; }
`;

const dlCycle = keyframes`
  10%  { transform: translateY(-102%); }
  25%  { transform: translateY(-100%); }
  35%  { transform: translateY(-202%); }
  50%  { transform: translateY(-200%); }
  60%  { transform: translateY(-302%); }
  75%  { transform: translateY(-300%); }
  85%  { transform: translateY(-402%); }
  100% { transform: translateY(-400%); }
`;

const dlBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
`;

const dlSweep = keyframes`
  0%   { width: 15%; transform: translateX(-120%); }
  45%  { width: 55%; }
  55%  { width: 55%; }
  100% { width: 15%; transform: translateX(750%); }
`;

const dlBounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); background: var(--dl-ink); }
  30%           { transform: translateY(-1em); background: var(--dl-purple); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
`;

/* 页面容器 */
const PageWrapper = styled.div<{ exiting: boolean }>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 72px;
  background: linear-gradient(
    135deg,
    #eef2ff 0%,
    #f5f7fa 30%,
    #f5f3ff 60%,
    #eef2ff 100%
  );
  background-size: 200% 200%;
  animation: ${({ exiting }) => (exiting ? `${fadeOut} 0.4s ease forwards` : 'none')};

  @media (max-width: 768px) {
    padding-top: 64px;
  }
`;

/* 加载器核心 */
const DoodleLoader = styled.div`
  --dl-ink: #2d2826;
  --dl-paper: #ffffff;
  --dl-card: #ffffff;
  --dl-purple: #7b5ea7;
  --dl-orange: #c85a28;
  --dl-green: #3d7a52;
  --dl-muted: #a89880;
  --dl-grid: #c4baa8;
  --dl-track: #e5ddd0;

  font-family: "Segoe Script", "Comic Sans MS", "Bradley Hand", cursive;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3em 3.5em;
  background-color: transparent;
  border-radius: 0.75em;
  cursor: default;
  transform: scale(1.5);
  transform-origin: center;

  @media (max-width: 768px) {
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    transform: scale(1);
    padding: 3em 2em;
  }
`;

/* 浮动涂鸦 SVG */
const Doodle = styled.svg<{ variant: number }>`
  position: absolute;
  pointer-events: none;

  ${({ variant }) => {
    switch (variant) {
      case 1:
        return `
          top: 0.7em; left: 0.9em; width: 3em; height: 3em;
          animation: ${dlFloatA} 3.5s ease-in-out infinite;
        `;
      case 2:
        return `
          top: 0.5em; right: 1.1em; width: 2.4em; height: 2.4em;
          animation: ${dlFloatB} 3s ease-in-out infinite 0.4s;
        `;
      case 3:
        return `
          bottom: 0.9em; left: 1.1em; width: 2.1em; height: 3.2em;
          animation: ${dlFloatA} 4s ease-in-out infinite 0.8s;
        `;
      case 4:
        return `
          bottom: 0.7em; right: 1em; width: 2.75em; height: 2.5em;
          animation: ${dlFloatB} 3.2s ease-in-out infinite 1s;
        `;
      case 5:
        return `
          top: 3em; left: 0.6em; width: 3.4em; height: 3.4em;
          animation: ${dlFloatA} 4.2s ease-in-out infinite 0.6s;
        `;
      case 6:
        return `
          bottom: 2.4em; right: 0.4em; width: 5.6em; height: 1.5em;
          animation: ${dlFloatB} 3.8s ease-in-out infinite 0.2s;
        `;
      default:
        return '';
    }
  }}
`;

/* 中央卡片 */
const Card = styled.div`
  position: relative;
  background: transparent;
  padding: 2em 2.7em 1.6em;
  border: 0.13em solid var(--dl-ink);
  border-radius: 0.2em 0.5em 0.3em 0.65em / 0.45em 0.2em 0.6em 0.3em;
  box-shadow: 0.4em 0.4em 0 0 var(--dl-ink);

  &::before {
    content: "";
    position: absolute;
    inset: 0.6em;
    border: 0.09em dashed var(--dl-grid);
    border-radius: 0.15em;
    pointer-events: none;
  }
`;

/* 胶带装饰 */
const Tape = styled.div`
  position: absolute;
  top: -0.95em;
  left: 50%;
  transform: translateX(-50%) rotate(-1.8deg);
  width: 5.5em;
  height: 1.6em;
  background: rgba(168, 138, 224, 0.38);
  border-left: 1.5px solid rgba(130, 100, 200, 0.25);
  border-right: 1.5px solid rgba(130, 100, 200, 0.25);
  z-index: 3;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent 0 5px,
      rgba(255, 255, 255, 0.22) 5px 7px
    );
  }
`;

/* 铅笔动画 */
const Pencil = styled.svg`
  position: absolute;
  top: -2.1em;
  right: 2em;
  width: 1.9em;
  height: 2.3em;
  transform-origin: bottom center;
  animation: ${dlWrite} 2.4s ease-in-out infinite;
  z-index: 4;
`;

/* 角落装饰 */
const Corner = styled.svg<{ position: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  width: 1.4em;
  height: 1.4em;
  pointer-events: none;

  ${({ position }) => {
    switch (position) {
      case 'tl':
        return 'top: 0.9em; left: 0.9em;';
      case 'tr':
        return 'top: 0.9em; right: 0.9em; transform: scaleX(-1);';
      case 'bl':
        return 'bottom: 0.9em; left: 0.9em; transform: scaleY(-1);';
      case 'br':
        return 'bottom: 0.9em; right: 0.9em; transform: scale(-1);';
      default:
        return '';
    }
  }}
`;

/* 文字行 */
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35em;
`;

const Prefix = styled.span`
  font-size: 2em;
  font-weight: 600;
  color: var(--dl-ink);
`;

const Words = styled.div`
  height: 2em;
  overflow: hidden;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 28%;
    z-index: 5;
    pointer-events: none;
  }

  &::before {
    top: 0;
    background: linear-gradient(var(--dl-card), transparent);
  }

  &::after {
    bottom: 0;
    background: linear-gradient(transparent, var(--dl-card));
  }
`;

const Word = styled.span`
  display: block;
  height: 100%;
  font-size: 2em;
  line-height: 1;
  font-weight: 700;
  color: var(--dl-purple);
  padding-left: 0.22em;
  animation: ${dlCycle} 4s infinite;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0.08em;
    left: 0.22em;
    right: 0;
    height: 0.18em;
    transform-origin: left;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='4'%3E%3Cpath d='M0 2 C2 0,4 4,6 2 C8 0,10 4,12 2 C14 0,16 4,18 2' stroke='%237B5EA7' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-size: auto 100%;
    animation: ${dlUnderline} 4s infinite;
  }
`;

const SubText = styled.p`
  font-size: 0.95em;
  color: var(--dl-muted);
  text-align: center;
  margin-top: 0.45em;
  animation: ${dlBlink} 2.2s ease-in-out infinite;
`;

/* 进度条 */
const Track = styled.div`
  height: 0.58em;
  background: var(--dl-track);
  border: 0.09em solid var(--dl-ink);
  border-radius: 1em;
  overflow: hidden;
  margin-top: 0.9em;
`;

const Fill = styled.div`
  height: 100%;
  width: 30%;
  background: var(--dl-purple);
  border-radius: 1em;
  animation: ${dlSweep} 2.6s ease-in-out infinite;
`;

/* 跳动圆点 */
const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75em;
  margin-top: 0.9em;
`;

const Dot = styled.span`
  display: inline-block;
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  background: var(--dl-ink);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
  animation: ${dlBounce} 1.4s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.16s;
  }

  &:nth-child(3) {
    animation-delay: 0.32s;
  }

  &:hover {
    background: var(--dl-purple);
    transform: scale(1.6) !important;
  }

  &:focus-visible {
    outline: 0.15em solid var(--dl-purple);
    outline-offset: 0.2em;
  }
`;

interface LoadingPageProps {
  onEnter: () => void;
}

export default function LoadingPage({ onEnter }: LoadingPageProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onEnter(), 400);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onEnter]);

  return (
    <PageWrapper exiting={exiting}>
      <DoodleLoader>
        {/* 浮动装饰 SVG */}
        <Doodle variant={1} viewBox="0 0 48 48" fill="none">
          <path d="M24 4 L27 21 L44 24 L27 27 L24 44 L21 27 L4 24 L21 21 Z" stroke="#2D2826" strokeWidth={2} strokeLinejoin="round" fill="#F0E8FF" />
          <circle cx={24} cy={24} r="3.5" fill="#7B5EA7" />
        </Doodle>
        <Doodle variant={2} viewBox="0 0 38 38" fill="none">
          <line x1={19} y1={3} x2={19} y2={35} stroke="#C85A28" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={3} y1={13} x2={35} y2={25} stroke="#C85A28" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={35} y1={13} x2={3} y2={25} stroke="#C85A28" strokeWidth="2.5" strokeLinecap="round" />
        </Doodle>
        <Doodle variant={3} viewBox="0 0 34 52" fill="none">
          <path d="M22 2 L8 26 L17 26 L12 50 L28 22 L18 22 Z" stroke="#2D2826" strokeWidth={2} strokeLinejoin="round" fill="#FFF3CD" />
        </Doodle>
        <Doodle variant={4} viewBox="0 0 44 40" fill="none">
          <path d="M22 36 C22 36, 2 22, 2 12 C2 6, 8 2, 14 4 C18 6, 22 10, 22 12 C22 10, 26 6, 30 4 C36 2, 42 6, 42 12 C42 22, 22 36, 22 36 Z" stroke="#2D2826" strokeWidth={2} strokeLinejoin="round" fill="#FFE0E6" />
        </Doodle>
        <Doodle variant={5} viewBox="0 0 54 54" fill="none">
          <path d="M27 27 C27 19, 37 15, 41 23 C45 31, 37 41, 25 39 C13 37, 9 23, 17 15 C25 7, 43 9, 47 23" stroke="#3D7A52" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <circle cx={27} cy={27} r={3} fill="#3D7A52" />
        </Doodle>
        <Doodle variant={6} viewBox="0 0 90 24" fill="none">
          <path d="M2 12 C10 2,18 22,26 12 C34 2,42 22,50 12 C58 2,66 22,74 12 C82 2,88 16,90 12" stroke="#2D2826" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </Doodle>

        {/* 中央卡片 */}
        <Card>
          <Tape aria-hidden="true" />

          <Pencil viewBox="0 0 30 36" fill="none">
            <rect x={8} y={2} width={14} height={24} rx={2} fill="#FFD966" stroke="#2D2826" strokeWidth="1.5" />
            <polygon points="8,26 22,26 15,35" fill="#F0A060" stroke="#2D2826" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1={15} y1={31} x2={15} y2={36} stroke="#2D2826" strokeWidth="1.5" strokeLinecap="round" />
            <rect x={8} y={2} width={14} height={6} rx={1} fill="#FF8888" stroke="#2D2826" strokeWidth="1.5" />
            <line x1={8} y1={8} x2={22} y2={8} stroke="#2D2826" strokeWidth="1.5" />
          </Pencil>

          <Corner position="tl" viewBox="0 0 22 22" fill="none">
            <path d="M3 19 C3 11,11 3,19 3" stroke="#A89880" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={3} cy={19} r={2} fill="#A89880" opacity="0.45" />
          </Corner>
          <Corner position="tr" viewBox="0 0 22 22" fill="none">
            <path d="M3 19 C3 11,11 3,19 3" stroke="#A89880" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={3} cy={19} r={2} fill="#A89880" opacity="0.45" />
          </Corner>
          <Corner position="bl" viewBox="0 0 22 22" fill="none">
            <path d="M3 19 C3 11,11 3,19 3" stroke="#A89880" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={3} cy={19} r={2} fill="#A89880" opacity="0.45" />
          </Corner>
          <Corner position="br" viewBox="0 0 22 22" fill="none">
            <path d="M3 19 C3 11,11 3,19 3" stroke="#A89880" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={3} cy={19} r={2} fill="#A89880" opacity="0.45" />
          </Corner>

          <Row>
            <Prefix>loading</Prefix>
            <Words aria-live="polite" aria-label="loading content">
              <Word>buttons</Word>
              <Word>forms</Word>
              <Word>switches</Word>
              <Word>cards</Word>
              <Word>buttons</Word>
            </Words>
          </Row>
          <SubText>please wait a moment...</SubText>

          <Track role="progressbar" aria-label="Loading progress">
            <Fill />
          </Track>

          <Dots role="img" aria-label="Loading">
            <Dot tabIndex={0} />
            <Dot tabIndex={0} />
            <Dot tabIndex={0} />
          </Dots>
        </Card>
      </DoodleLoader>
    </PageWrapper>
  );
}
