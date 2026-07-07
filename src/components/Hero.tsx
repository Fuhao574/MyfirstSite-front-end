/**
 * Hero 区域组件
 * 个人区域居中 + 日历组件 + 下方6张卡片网格
 */

import { useState, useEffect } from 'react';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { heroData } from '../data/mockData';
import ParticleBackground from './ParticleBackground';
import CalendarCard from './CalendarCard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  Globe, Wifi, Music, Wallet,
} from 'lucide-react';

/* 动画 */
const pulseGlow = keyframes`
  0%, 100% { opacity: 0.2; filter: blur(14px); }
  50%      { opacity: 0.45; filter: blur(20px); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/* ============================================
   滚动浮现容器
   ============================================ */
const RevealSection = styled.div<{ visible: boolean }>`
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.0),
              transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.0);

  ${({ visible }) =>
    visible &&
    css`
      opacity: 1;
      transform: translateY(0);
    `}
`;

function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  return (
    <RevealSection ref={ref} visible={isVisible} className={className}>
      {children}
    </RevealSection>
  );
}

/* Hero 容器 */
const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  padding: 120px ${theme.spacing.xl} ${theme.spacing['4xl']};
  overflow: hidden;

  background: linear-gradient(
    135deg,
    #eef2ff 0%,
    #f5f7fa 30%,
    #f5f3ff 60%,
    #eef2ff 100%
  );
  background-size: 200% 200%;
  animation: ${shimmer} 15s ease-in-out infinite alternate;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 100px ${theme.spacing.md} ${theme.spacing['2xl']};
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

/* ============================================
   个人区域：居中，约40%宽度
   ============================================ */
const ProfileArea = styled.div`
  max-width: 480px;
  width: 100%;
  margin: 0 auto ${theme.spacing['2xl']};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing.xl};
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;

  &::before {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.gradientBlue};
    animation: ${pulseGlow} 3s ease-in-out infinite;
    z-index: -1;
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: ${theme.transitions.default};

  &:hover {
    transform: scale(1.06) rotate(-2deg);
  }
`;

const Name = styled.h1`
  font-size: 42px;
  font-weight: 700;
  color: #1A1A2E;
  letter-spacing: -1px;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 32px;
  }
`;

const TypewriterContainer = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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

/* ============================================
   日历区域（临时放置）
   ============================================ */
const CalendarArea = styled.div`
  max-width: 360px;
  margin: 0 auto ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing.xl};
  }
`;

/* ============================================
   卡片网格：6张卡片
   ============================================ */
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.lg};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: ${theme.spacing.md};
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: ${theme.transitions.default};
  cursor: default;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const CardIcon = styled.div<{ accent: string }>`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ accent }) => accent};
  color: #ffffff;
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
    stroke-width: 2;
  }
`;

const CardLabel = styled.span`
  margin-left: ${theme.spacing.sm};
  color: #374151;
  font-size: 14px;
  font-weight: 500;
`;

const CardIndicator = styled.span<{ color: string }>`
  margin-left: auto;
  color: ${({ color }) => color};
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardValue = styled.p`
  margin: ${theme.spacing.sm} 0;
  color: #1F2937;
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 700;
  text-align: left;
`;

const ProgressTrack = styled.div`
  position: relative;
  background-color: #E5E7EB;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number; color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ width }) => width}%;
  background-color: ${({ color }) => color};
  border-radius: 4px;
  transition: width 1.2s cubic-bezier(0.25, 0.1, 0.25, 1.0);
`;

/* ============================================
   打字机 Hook
   ============================================ */
function useTypewriter(text: string, speed: number = 100, delay: number = 800) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    setIsDone(false);

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return { displayed, isDone };
}

function Typewriter({ text, speed = 90 }: { text: string; speed?: number }) {
  const { displayed, isDone } = useTypewriter(text, speed);

  return (
    <TypewriterContainer>
      <TypedText>"{displayed}<Cursor blink={isDone ? false : true} />"</TypedText>
    </TypewriterContainer>
  );
}

/* ============================================
   数据 Hooks
   ============================================ */
function useVisitorLocation() {
  const [location, setLocation] = useState('获取中...');

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data.city && data.country_name) {
          setLocation(`${data.city}, ${data.country_name}`);
        } else if (data.city) {
          setLocation(data.city);
        } else {
          setLocation('未知地区');
        }
      })
      .catch(() => setLocation('未知地区'));
  }, []);

  return location;
}

function useBrowserInfo() {
  const [info, setInfo] = useState('检测中...');

  useEffect(() => {
    const ua = navigator.userAgent;
    let browser = '未知浏览器';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    const detectPlatform = async () => {
      if ((navigator as any).userAgentData?.getHighEntropyValues) {
        try {
          const data = await (navigator as any).userAgentData.getHighEntropyValues(['architecture']);
          if (data.architecture === 'arm') return 'Apple Silicon';
          if (data.architecture === 'x86') return 'Intel';
        } catch (e) {}
      }

      if (navigator.platform === 'MacIntel') {
        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
              if (renderer && renderer.includes('Apple')) {
                return 'Apple Silicon';
              }
            }
          }
        } catch (e) {}
        return 'Intel';
      }

      return navigator.platform || '未知平台';
    };

    detectPlatform().then(platform => {
      setInfo(`${browser} · ${platform}`);
    });
  }, []);

  return info;
}

export default function Hero() {
  const location = useVisitorLocation();
  const browserInfo = useBrowserInfo();

  const cards = [
    {
      accent: '#3B82F6',
      icon: <Wifi />,
      label: '你的位置',
      value: location,
      iconBg: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    },
    {
      accent: '#14B8A6',
      icon: <Globe />,
      label: '浏览器 / 平台',
      value: browserInfo,
      iconBg: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    },
    {
      accent: '#FF9500',
      icon: <Music />,
      label: '听歌时长',
      value: '127h',
      iconBg: 'linear-gradient(135deg, #FF9500 0%, #F97316 100%)',
      progress: 42,
      trend: 'down' as const,
    },
    {
      accent: '#3B82F6',
      icon: <Wallet />,
      label: '当月预算',
      value: '¥3,280',
      iconBg: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      progress: 66,
      trend: 'up' as const,
    },
  ];

  return (
    <HeroSection id="hero">
      <ParticleBackground />
      <Content>
        <ScrollReveal>
          <ProfileArea>
            <AvatarWrapper>
              <Avatar src={heroData.avatar} alt={heroData.name} />
            </AvatarWrapper>
            <Name>{heroData.name}</Name>
            <Typewriter text="The world has no shortage of adults" speed={43} />
          </ProfileArea>
        </ScrollReveal>

        <ScrollReveal>
          <CalendarArea>
            <CalendarCard />
          </CalendarArea>
        </ScrollReveal>

        {/* 卡片网格：4张 */}
        <CardsGrid>
          {cards.map((card, i) => {
            const trendColor = card.trend === 'up' ? '#22C55E' : card.trend === 'down' ? '#B9101E' : card.accent;
            const hasIndicator = card.progress !== undefined;
            return (
              <ScrollReveal key={i}>
                <Card>
                  <CardTitle>
                    <CardIcon accent={card.accent}>{card.icon}</CardIcon>
                    <CardLabel>{card.label}</CardLabel>
                    {hasIndicator && (
                      <CardIndicator color={trendColor}>
                        {card.trend === 'up' ? (
                          <span style={{
                            width: 0, height: 0,
                            borderLeft: '5px solid transparent',
                            borderRight: '5px solid transparent',
                            borderBottom: `7px solid ${trendColor}`,
                          }} />
                        ) : card.trend === 'down' ? (
                          <span style={{
                            width: 0, height: 0,
                            borderLeft: '5px solid transparent',
                            borderRight: '5px solid transparent',
                            borderTop: `7px solid ${trendColor}`,
                          }} />
                        ) : null}
                        {card.progress}%
                      </CardIndicator>
                    )}
                  </CardTitle>
                  <CardValue>{card.value}</CardValue>
                  {hasIndicator && (
                    <ProgressTrack>
                      <ProgressFill width={card.progress} color={card.accent} />
                    </ProgressTrack>
                  )}
                </Card>
              </ScrollReveal>
            );
          })}
        </CardsGrid>
      </Content>
    </HeroSection>
  );
}
