/**
 * 个人介绍卡片组件
 * 统一卡片样式：白底 + 细边框 + 柔和投影
 */

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { Github, Twitter, Mail, Link as LinkIcon } from 'lucide-react';

/* 入场动画 */
const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ============================================
   卡片容器
   ============================================ */
const ProfileWrapper = styled.div`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  box-shadow: ${theme.card.shadow};
  overflow: hidden;
  width: 100%;

  animation: ${cardEnter} 0.6s 0.1s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  transition: ${theme.transitions.default};

  &:hover {
    box-shadow: ${theme.card.shadowHover};
    transform: translateY(-2px);
  }
`;

/* ============================================
   头像
   ============================================ */
const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: ${theme.borderRadius.full};
  border: 3px solid #ffffff;
  object-fit: cover;
  display: block;
  margin: ${theme.spacing.lg} auto 0;
  background: ${theme.colors.bgTertiary};
  box-shadow: 0 4px 16px rgba(14, 17, 22, 0.12);
  transition: ${theme.transitions.default};

  &:hover {
    transform: scale(1.06);
  }
`;

/* ============================================
   内容区
   ============================================ */
const Content = styled.div`
  padding: ${theme.spacing.md} ${theme.card.padding.split(' ').slice(1).join(' ')} ${theme.card.padding.split(' ').slice(-1)[0]};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.5px;
`;

const Signature = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  margin: ${theme.spacing.xs} 0 0;
  line-height: 1.5;
`;

/* 分隔线 */
const Divider = styled.div`
  width: 36px;
  height: 3px;
  border-radius: 2px;
  background: #e3e8ee;
  margin: ${theme.spacing.md} 0;
`;

/* ============================================
   社交按钮
   ============================================ */
const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const SocialButton = styled.a`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f6fa;
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  border: 1px solid #eef2f6;
  transition: ${theme.transitions.default};

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }

  &:hover {
    background: ${theme.colors.accentBlue};
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 125, 239, 0.3);
  }
`;

/* ============================================
   社交链接配置
   ============================================ */
const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/fuhao574', icon: <Github /> },
  { label: 'Twitter / X', href: '#', icon: <Twitter /> },
  { label: 'Email', href: 'mailto:your@email.com', icon: <Mail /> },
  { label: 'Website', href: '#', icon: <LinkIcon /> },
];

/* ============================================
   组件
   ============================================ */
export default function ProfileCard() {
  return (
    <ProfileWrapper>
      <Avatar src="/avatar.jpg" alt="Fuhao574 的头像" />
      <Content>
        <Name>Fuhao574</Name>
        <Signature>The World Has No Shortage Of Adults</Signature>
        <Divider />
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
