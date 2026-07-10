/**
 * LoginCard — 登录卡片弹窗
 * 点击导航栏头像时展示，包含头像选择 + 昵称输入
 * 统一卡片样式：白底 + 细边框 + 柔和投影
 */

import { useState, useRef, useEffect } from 'react';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { User, Plus, ArrowRight, X } from 'lucide-react';

/* ============================================
   动画
   ============================================ */
const overlayFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const cardSlideIn = keyframes`
  from { opacity: 0; transform: translateY(-12px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const sparklePulse = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50%      { transform: scale(1.15) rotate(8deg); opacity: 0.8; }
`;

const arrowBounce = keyframes`
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(5px); }
`;

const avatarPop = keyframes`
  0%   { transform: scale(0.8); }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1.1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

/* ============================================
   预设头像
   ============================================ */
const DEFAULT_AVATARS = [
  { id: 0, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix' },
  { id: 1, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka' },
  { id: 2, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sasha' },
  { id: 3, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nala' },
];

/* ============================================
   遮罩层
   ============================================ */
const Overlay = styled.div<{ closing: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: ${({ closing }) => (closing ? fadeOut : overlayFadeIn)} 0.2s ease both;
`;

/* ============================================
   登录卡片 — 统一卡片样式
   ============================================ */
const Card = styled.div`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  box-shadow: 0 25px 60px rgba(14, 17, 22, 0.2);
  width: 380px;
  max-width: calc(100vw - 32px);
  padding: 28px 28px 24px;
  position: relative;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  animation: ${cardSlideIn} 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: calc(100vw - 32px);
    padding: 24px 20px 20px;
  }
`;

/* 关闭按钮 */
const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f6fa;
  color: #5b6472;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #e3e8ee;
    color: #0e1116;
  }
`;

/* ============================================
   内容区
   ============================================ */
const SparkleIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  animation: ${sparklePulse} 2.5s ease-in-out infinite;

  svg {
    width: 28px;
    height: 28px;
    fill: #0e1116;
  }
`;

const Headline = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #0e1116;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
  text-align: center;
`;

const Subheadline = styled.p`
  font-size: 13px;
  color: #5b6472;
  margin: 0 0 28px 0;
  text-align: center;
`;

/* ============================================
   头像选择区
   ============================================ */
const AvatarRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 28px;
`;

const AvatarButton = styled.button<{ selected: boolean }>`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid ${({ selected }) => (selected ? '#0e1116' : '#e3e8ee')};
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  background: #f3f6fa;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${({ selected }) =>
    selected
      ? css`
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(14, 17, 22, 0.15);
          animation: ${avatarPop} 0.3s ease both;
        `
      : css`
          opacity: 0.7;
          filter: grayscale(30%);

          &:hover {
            opacity: 1;
            filter: grayscale(0);
            transform: translateY(-2px);
          }
        `}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid #fff;
    border-radius: 50%;
    opacity: ${({ selected }) => (selected ? 1 : 0)};
  }
`;

const UploadButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px dashed #d1d5db;
  background: #f9fafb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: #5b6472;
    border-color: #5b6472;
    transform: rotate(90deg);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

/* ============================================
   表单
   ============================================ */
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 4px;

  svg {
    width: 13px;
    height: 13px;
    color: #9ca3af;
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 600;
  color: #0e1116;
  background: #f9fafb;
  border: 1px solid #e3e8ee;
  border-radius: 16px;
  outline: none;
  transition: all 0.15s ease;
  box-sizing: border-box;
  font-family: inherit;

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  &:focus {
    background: #ffffff;
    border-color: #2e7def;
    box-shadow: 0 0 0 4px rgba(46, 125, 239, 0.1);
  }
`;

/* ============================================
   按钮
   ============================================ */
const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 800;
  border: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  font-family: inherit;

  background: ${({ disabled }) => (disabled ? '#f3f4f6' : '#0e1116')};
  color: ${({ disabled }) => (disabled ? '#9ca3af' : '#ffffff')};

  ${({ disabled }) =>
    !disabled &&
    css`
      box-shadow: 0 8px 24px rgba(14, 17, 22, 0.2);

      &:hover {
        background: #000000;
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(14, 17, 22, 0.25);
      }

      &:active {
        transform: translateY(0) scale(0.98);
      }
    `}

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover svg {
    animation: ${arrowBounce} 1.5s ease-in-out infinite;
  }
`;

/* ============================================
   底部
   ============================================ */
const Footer = styled.div`
  margin-top: 24px;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`;

/* ============================================
   上传预览弹窗
   ============================================ */
const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border-radius: ${theme.card.radius};
  animation: ${overlayFadeIn} 0.2s ease both;
`;

const PreviewModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const PreviewTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #0e1116;
  margin: 0 0 20px 0;
`;

const PreviewAvatar = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid #0e1116;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PreviewButtons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const PreviewBtn = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 10px 14px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border: ${({ primary }) => (primary ? 'none' : '2px solid #e3e8ee')};
  background: ${({ primary }) => (primary ? '#0e1116' : 'transparent')};
  color: ${({ primary }) => (primary ? '#ffffff' : '#5b6472')};

  &:hover {
    ${({ primary }) =>
      primary
        ? css`
            box-shadow: 0 6px 16px rgba(14, 17, 22, 0.25);
            transform: translateY(-2px);
          `
        : css`
            background: #f9fafb;
            color: #0e1116;
          `}
  }
`;

/* ============================================
   组件
   ============================================ */
interface LoginCardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginCard({ onClose, onSuccess }: LoginCardProps) {
  const [username, setUsername] = useState('');
  const [avatars, setAvatars] = useState(DEFAULT_AVATARS);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ESC 关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const confirmCustomAvatar = () => {
    if (previewImage) {
      const newId = avatars.length;
      setAvatars([...avatars, { id: newId, url: previewImage }]);
      setSelectedAvatar(newId);
      setPreviewImage(null);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || loading) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setClosing(true);
      setTimeout(() => onSuccess(), 200);
    }, 1000);
  };

  return (
    <Overlay closing={closing} onClick={handleClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <X />
        </CloseButton>

        {/* 上传预览 */}
        {previewImage && (
          <PreviewOverlay>
            <PreviewModal>
              <PreviewTitle>预览头像</PreviewTitle>
              <PreviewAvatar>
                <img src={previewImage} alt="preview" />
              </PreviewAvatar>
              <PreviewButtons>
                <PreviewBtn onClick={() => setPreviewImage(null)}>取消</PreviewBtn>
                <PreviewBtn primary onClick={confirmCustomAvatar}>确认</PreviewBtn>
              </PreviewButtons>
            </PreviewModal>
          </PreviewOverlay>
        )}

        <SparkleIcon>
          <svg viewBox="0 0 100 100">
            <path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" />
          </svg>
        </SparkleIcon>

        <Headline>欢迎来访！</Headline>
        <Subheadline>选择您的形象并输入姓名</Subheadline>

        {/* 头像选择 */}
        <AvatarRow>
          {avatars.map((avatar) => (
            <AvatarButton
              key={avatar.id}
              selected={selectedAvatar === avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
            >
              <img src={avatar.url} alt="avatar" />
            </AvatarButton>
          ))}
          <UploadButton onClick={() => fileInputRef.current?.click()}>
            <Plus />
          </UploadButton>
          <HiddenInput
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
          />
        </AvatarRow>

        {/* 表单 */}
        <Form onSubmit={handleLogin}>
          <FieldGroup>
            <FieldLabel>
              <User />
              用户姓名
            </FieldLabel>
            <TextInput
              type="text"
              value={username}
              placeholder="在此输入您的昵称..."
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </FieldGroup>

          <SubmitButton type="submit" disabled={!username || loading}>
            <span>{loading ? '同步中...' : '同步身份并登录'}</span>
            {!loading && <ArrowRight />}
          </SubmitButton>
        </Form>

        <Footer>专属数字身份</Footer>
      </Card>
    </Overlay>
  );
}
