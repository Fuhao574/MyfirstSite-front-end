/**
 * 个人介绍卡片组件
 * 大头像 + 名字 + 签名 + 社交链接
 */

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { Github, Twitter, Mail, Link as LinkIcon } from 'lucide-react';

/* 入场动画：从下方淡入上移 */
const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ============================================
   卡片容器
   ============================================ */
const ProfileWrapper = styled.div`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadowLight};
  border: 1px solid rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  width: 100%;

  animation: ${cardEnter} 0.6s 0.1s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-6px);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.08),
      0 12px 40px rgba(0, 0, 0, 0.06);
  }
`;

/* ============================================
   顶部渐变 Banner
   ============================================ */
const Banner = styled.div`
  height: 90px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
`;

/* ============================================
   大头像
   ============================================ */
const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: ${theme.borderRadius.full};
  border: 5px solid #ffffff;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.bgTertiary};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  transition: ${theme.transitions.default};
  z-index: 2;

  &:hover {
    transform: translateX(-50%) scale(1.08);
  }
`;

/* ============================================
   内容区
   ============================================ */
const Content = styled.div`
  padding: 0 ${theme.spacing.lg} ${theme.spacing.lg};
  text-align: center;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.3px;
`;

const Signature = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0;
  line-height: 1.5;
`;

/* ============================================
   社交按钮
   ============================================ */
const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;

const SocialButton = styled.a`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bgTertiary};
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  transition: ${theme.transitions.default};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 38px;
    height: 38px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

/* ============================================
   社交链接配置
   ============================================ */
const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/fuhao574',
    icon: <Github />,
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: <Twitter />,
  },
  {
    label: 'Email',
    href: 'mailto:your@email.com',
    icon: <Mail />,
  },
  {
    label: 'Website',
    href: '#',
    icon: <LinkIcon />,
  },
];

/* ============================================
   组件
   ============================================ */
export default function ProfileCard() {
  return (
    <ProfileWrapper>
      <Banner />
      <Avatar src="/avatar.jpg" alt="Fuhao574 的头像" />
      <Content>
        <Name>Fuhao574</Name>
        <Signature>The World Has No Shortage Of Adults</Signature>
        <SocialRow>
          {SOCIAL_LINKS.map((item) => (
            <SocialButton
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={item.label}
              title={item.label}
            >
              {item.icon}
            </SocialButton>
          ))}
        </SocialRow>
      </Content>
    </ProfileWrapper>
  );
}
