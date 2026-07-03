/**
 * Hero 区域组件
 * 居中显示圆形头像、姓名、职业标签、个性签名
 * 带有微妙的渐变背景和动态粒子效果
 */

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

  /* 外圈光晕 */
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.gradientBlue};
    opacity: 0.15;
    filter: blur(12px);
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: ${theme.shadowMedium};
  transition: ${theme.transitions.default};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${theme.shadowHeavy};
  }
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
  letter-spacing: -1px;
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 36px;
  }
`;

const Title = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: 500;
  color: ${theme.colors.accentBlue};
  background: rgba(99, 102, 241, 0.08);
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.full};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 16px;
  }
`;

const Tagline = styled.p`
  font-size: 20px;
  font-weight: 300;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 18px;
  }
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
        <Title>{heroData.title}</Title>
        <Tagline>{heroData.tagline}</Tagline>
      </Content>
      <ScrollIndicator>
        <span>Scroll</span>
      </ScrollIndicator>
    </HeroSection>
  );
}
