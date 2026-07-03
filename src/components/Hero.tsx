/**
 * Hero 区域组件
 * 居中显示圆形头像、姓名、打字机签名
 * 带有微妙的渐变背景和动态粒子效果
 */

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { heroData } from '../data/mockData';
import ParticleBackground from './ParticleBackground';

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  /* 微妙的渐变背景 */
  background: linear-gradient(
    180deg,
    #eef2ff 0%,
    #f5f7fa 40%,
    #f5f3ff 70%,
    #f5f7fa 100%
  );
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: ${theme.spacing.xl};
  max-width: 600px;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto ${theme.spacing.xl};

  /* 外圈光晕 - 更明亮柔和 */
  &::before {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.gradientBlue};
    opacity: 0.25;
    filter: blur(16px);
    z-index: -1;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
  /* 纯白色边框，不透光，让头像更鲜明 */
  border: 4px solid #ffffff;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: ${theme.transitions.default};

  &:hover {
    transform: scale(1.05);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(0, 0, 0, 0.04);
  }
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.lg};
  letter-spacing: -1px;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 36px;
  }
`;

/* ============================================
   打字机效果组件
   ============================================ */
const TypewriterContainer = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 18px;
  }
`;

const TypedText = styled.span`
  font-style: italic;
  letter-spacing: 0.5px;
`;

const Cursor = styled.span<{ blink: boolean }>`
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: ${theme.colors.accentBlue};
  margin-left: 3px;
  vertical-align: text-bottom;
  opacity: ${({ blink }) => (blink ? 1 : 0)};
  transition: opacity 0.1s ease-out;
`;

/* 打字机 Hook */
function useTypewriter(text: string, speed: number = 100, delay: number = 800) {
  const [displayed, setDisplayed] = useState('');
  const [cursorBlink, setCursorBlink] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    setIsDone(false);
    setCursorBlink(false);

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(interval);
          setIsDone(true);
          // 打完字后光标开始闪烁
          const blinkInterval = setInterval(() => {
            setCursorBlink((prev) => !prev);
          }, 530);
          return () => clearInterval(blinkInterval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return { displayed, cursorBlink, isDone };
}

function Typewriter({ text, speed = 90 }: { text: string; speed?: number }) {
  const { displayed, cursorBlink, isDone } = useTypewriter(text, speed);

  return (
    <TypewriterContainer>
      <TypedText>"{displayed}"</TypedText>
      <Cursor blink={isDone ? cursorBlink : true} />
    </TypewriterContainer>
  );
}

/* ============================================
   iCost 风格小卡片组
   ============================================ */
const WidgetsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: ${theme.spacing.sm};
  }
`;

const WidgetCard = styled.div<{ accent: string }>`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  min-width: 130px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: ${theme.transitions.default};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.xs};
  position: relative;
  overflow: hidden;

  /* 左侧装饰条 */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${({ accent }) => accent};
    opacity: 0.6;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.08),
      0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.colors.textTertiary};
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const WidgetValue = styled.span<{ color: string }>`
  font-size: 22px;
  font-weight: 700;
  color: ${({ color }) => color};
  line-height: 1.2;
  letter-spacing: -0.5px;
`;

const WidgetLabel = styled.span`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  font-weight: 400;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.textTertiary};
  animation: bounce 2s infinite ease-out;

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-8px);
    }
    60% {
      transform: translateX(-50%) translateY(-4px);
    }
  }

  span {
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* 下滑箭头 */
  &::after {
    content: '';
    width: 6px;
    height: 6px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
  }
`;

export default function Hero() {
  return (
    <HeroSection id="hero">
      <ParticleBackground />
      <Content>
        <AvatarWrapper>
          <Avatar src={heroData.avatar} alt={heroData.name} />
        </AvatarWrapper>
        <Name>{heroData.name}</Name>
        <Typewriter text="The world has no shortage of adults" speed={85} />

        {/* iCost 风格轻量小卡片 */}
        <WidgetsRow>
          <WidgetCard accent="#3B82F6">
            <WidgetHeader>💳 今日消费</WidgetHeader>
            <WidgetValue color="#3B82F6">¥128.50</WidgetValue>
            <WidgetLabel>比昨天 -15%</WidgetLabel>
          </WidgetCard>

          <WidgetCard accent="#F97316">
            <WidgetHeader>☕ 专注时长</WidgetHeader>
            <WidgetValue color="#F97316">3h 42m</WidgetValue>
            <WidgetLabel>今日目标 4h</WidgetLabel>
          </WidgetCard>

          <WidgetCard accent="#14B8A6">
            <WidgetHeader>🔥 连续打卡</WidgetHeader>
            <WidgetValue color="#14B8A6">21 天</WidgetValue>
            <WidgetLabel>本月最高记录</WidgetLabel>
          </WidgetCard>
        </WidgetsRow>
      </Content>
      <ScrollIndicator>
        <span>Scroll</span>
      </ScrollIndicator>
    </HeroSection>
  );
}
