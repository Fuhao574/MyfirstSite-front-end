/**
 * Hero 区域组件
 * 布局：左(头像+名字+签名 靠左) + 中(小卡片) + 右(日历卡片)
 */

import { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { heroData } from '../data/mockData';
import ParticleBackground from './ParticleBackground';
import CalendarCard from './CalendarCard';
import {
  MapPin, Clock, Globe, Wifi, Music, Wallet,
} from 'lucide-react';

/* 动画 */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.2; filter: blur(14px); }
  50%      { opacity: 0.45; filter: blur(20px); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

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
   三栏布局
   ============================================ */
const HeroLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${theme.spacing.xl};
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

/* 左栏：个人区域靠左 */
const ProfileArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.lg};
  animation: ${fadeInUp} 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;

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
  font-size: 36px;
  font-weight: 700;
  color: #1A1A2E;
  letter-spacing: -1px;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 28px;
  }
`;

const TypewriterContainer = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
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
   中栏：小卡片网格
   ============================================ */
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Card = styled.div<{ accent: string; delay: number }>`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadowLight};
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: ${theme.transitions.default};
  cursor: default;
  position: relative;
  overflow: hidden;

  animation: ${cardEnter}
    ${({ delay }) => 0.4 + delay * 0.08}s
    cubic-bezier(0.25, 0.1, 0.25, 1.0) both;

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
    transform: translateY(-4px);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.08),
      0 12px 40px rgba(0, 0, 0, 0.06);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

const CardIcon = styled.div<{ bg: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bg }) => bg};
  color: white;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2.2;
  }
`;

const CardInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`;

const CardLabel = styled.span`
  font-size: 11px;
  color: ${theme.colors.textTertiary};
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const CardValue = styled.span<{ color: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ color }) => color};
  line-height: 1.2;
  letter-spacing: -0.3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 5px;
  background: ${theme.colors.bgTertiary};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${theme.spacing.xs};
`;

const ProgressBarFill = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: ${({ color }) => color};
  border-radius: ${theme.borderRadius.full};
  transition: width 1.2s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  opacity: 0.8;
`;

const CardSub = styled.span`
  font-size: 11px;
  color: ${theme.colors.textSecondary};
  margin-top: 2px;
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

function useCurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return { timeStr: `${hours}:${minutes}:${seconds}`, dateStr: time.toLocaleDateString('zh-CN') };
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
  const { timeStr, dateStr } = useCurrentTime();
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
      accent: '#F97316',
      icon: <Clock />,
      label: '当前时间',
      value: timeStr,
      iconBg: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    },
    {
      accent: '#14B8A6',
      icon: <Globe />,
      label: '浏览器',
      value: browserInfo,
      iconBg: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    },
    {
      accent: '#8B5CF6',
      icon: <MapPin />,
      label: '访问日期',
      value: dateStr,
      iconBg: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    },
    {
      accent: '#FF9500',
      icon: <Music />,
      label: '听歌时长',
      value: '127h',
      iconBg: 'linear-gradient(135deg, #FF9500 0%, #F97316 100%)',
      progress: 42,
      sub: '本月累计 · 最爱周杰伦',
    },
    {
      accent: '#3B82F6',
      icon: <Wallet />,
      label: '当月预算',
      value: '¥3,280',
      iconBg: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      progress: 66,
      sub: '总额 ¥5,000 · 剩余 ¥1,720',
    },
  ];

  return (
    <HeroSection id="hero">
      <ParticleBackground />
      <Content>
        <HeroLayout>
          {/* 左栏：个人区域靠左 */}
          <ProfileArea>
            <AvatarWrapper>
              <Avatar src={heroData.avatar} alt={heroData.name} />
            </AvatarWrapper>
            <Name>{heroData.name}</Name>
            <Typewriter text="The world has no shortage of adults" speed={43} />
          </ProfileArea>

          {/* 中栏：6张小卡片（2列3行） */}
          <CardsGrid>
            {cards.map((card, i) => (
              <Card key={i} accent={card.accent} delay={i}>
                <CardHeader>
                  <CardIcon bg={card.iconBg}>{card.icon}</CardIcon>
                  <CardInfo>
                    <CardLabel>{card.label}</CardLabel>
                    <CardValue color={card.accent}>{card.value}</CardValue>
                  </CardInfo>
                </CardHeader>
                {card.progress && (
                  <ProgressBarContainer>
                    <ProgressBarFill width={card.progress} color={card.accent} />
                  </ProgressBarContainer>
                )}
                {card.sub && <CardSub>{card.sub}</CardSub>}
              </Card>
            ))}
          </CardsGrid>

          {/* 右栏：日历 */}
          <div>
            <CalendarCard />
          </div>
        </HeroLayout>
      </Content>
    </HeroSection>
  );
}
