/**
 * Hero 区域组件
 * 左侧：个人信息卡片（头像+名字+签名）
 * 右侧：访客信息小玩具（IP、时间等）
 * 使用 iCost 风格
 */

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { heroData } from '../data/mockData';
import ParticleBackground from './ParticleBackground';
import { MapPin, Clock, Globe, Wifi } from 'lucide-react';

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  background: linear-gradient(
    180deg,
    #eef2ff 0%,
    #f5f7fa 40%,
    #f5f3ff 70%,
    #f5f7fa 100%
  );
`;

const HeroGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['2xl']};
  align-items: center;
  max-width: 1000px;
  width: 100%;
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
    text-align: center;
  }
`;

/* ============================================
   左侧：个人信息卡片
   ============================================ */
const ProfileCard = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    align-items: center;
  }
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
    opacity: 0.2;
    filter: blur(14px);
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
`;

const Name = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  letter-spacing: -1px;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 28px;
  }
`;

/* 打字机效果 */
const TypewriterContainer = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 16px;
    justify-content: center;
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

/* ============================================
   右侧：访客信息小玩具
   ============================================ */
const ToysPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

/* iCost 风格小卡片 */
const ToyCard = styled.div<{ accent: string }>`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: ${theme.transitions.default};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
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
    transform: translateX(4px);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.08),
      0 8px 24px rgba(0, 0, 0, 0.06);
  }
`;

const ToyIcon = styled.div<{ bg: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ bg }) => bg};
  color: white;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.5;
  }
`;

const ToyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ToyLabel = styled.span`
  font-size: 12px;
  color: ${theme.colors.textTertiary};
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const ToyValue = styled.span<{ color: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ color }) => color};
  line-height: 1.2;
  letter-spacing: -0.3px;
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

/* 获取访客地区 */
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

/* 实时时间 Hook */
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

/* 浏览器信息 */
function useBrowserInfo() {
  const [info, setInfo] = useState('检测中...');

  useEffect(() => {
    const ua = navigator.userAgent;
    let browser = '未知浏览器';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    const platform = navigator.platform || '未知平台';
    setInfo(`${browser} · ${platform}`);
  }, []);

  return info;
}

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
    0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
    40% { transform: translateX(-50%) translateY(-8px); }
    60% { transform: translateX(-50%) translateY(-4px); }
  }

  span {
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

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
  const location = useVisitorLocation();
  const { timeStr, dateStr } = useCurrentTime();
  const browserInfo = useBrowserInfo();

  return (
    <HeroSection id="hero">
      <ParticleBackground />
      <HeroGrid>
        {/* 左侧：个人信息卡片 */}
        <ProfileCard>
          <AvatarWrapper>
            <Avatar src={heroData.avatar} alt={heroData.name} />
          </AvatarWrapper>
          <Name>{heroData.name}</Name>
          <Typewriter text="The world has no shortage of adults" speed={85} />
        </ProfileCard>

        {/* 右侧：访客信息小玩具 */}
        <ToysPanel>
          <ToyCard accent="#3B82F6">
            <ToyIcon bg="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)">
              <Wifi />
            </ToyIcon>
            <ToyInfo>
              <ToyLabel>你的位置</ToyLabel>
              <ToyValue color="#3B82F6">{location}</ToyValue>
            </ToyInfo>
          </ToyCard>

          <ToyCard accent="#F97316">
            <ToyIcon bg="linear-gradient(135deg, #F97316 0%, #EA580C 100%)">
              <Clock />
            </ToyIcon>
            <ToyInfo>
              <ToyLabel>当前时间</ToyLabel>
              <ToyValue color="#F97316">{timeStr}</ToyValue>
            </ToyInfo>
          </ToyCard>

          <ToyCard accent="#14B8A6">
            <ToyIcon bg="linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)">
              <Globe />
            </ToyIcon>
            <ToyInfo>
              <ToyLabel>浏览器 / 平台</ToyLabel>
              <ToyValue color="#14B8A6">{browserInfo}</ToyValue>
            </ToyInfo>
          </ToyCard>

          <ToyCard accent="#8B5CF6">
            <ToyIcon bg="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)">
              <MapPin />
            </ToyIcon>
            <ToyInfo>
              <ToyLabel>访问日期</ToyLabel>
              <ToyValue color="#8B5CF6">{dateStr}</ToyValue>
            </ToyInfo>
          </ToyCard>
        </ToysPanel>
      </HeroGrid>
      <ScrollIndicator>
        <span>Scroll</span>
      </ScrollIndicator>
    </HeroSection>
  );
}
