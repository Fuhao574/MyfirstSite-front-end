/**
 * LoginCard — 登录卡片弹窗
 * Visitor / Friend 双面翻转卡片
 * 统一卡片样式：白底 + 细边框 + 柔和投影
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { User, Plus, ArrowRight, X, Mail, Github, ShieldCheck } from 'lucide-react';

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
   模块级状态持久化（跨组件挂载）
   ============================================ */
let codeSentTimestamp: number | null = null;
let savedFriendEmail = '';
let savedIsFriend = false;

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
   卡片外层（定位 + 关闭按钮）
   ============================================ */
const CardShell = styled.div`
  width: 380px;
  max-width: calc(100vw - 32px);
  position: relative;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  animation: ${cardSlideIn} 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: calc(100vw - 32px);
  }
`;

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
  transition: background 0.15s ease, color 0.15s ease;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

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
   切换开关（Visitor / Friend）
   ============================================ */
const ToggleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const ModeText = styled.span<{ active: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ active }) => (active ? '#0e1116' : '#9ca3af')};
  transition: color 0.3s ease;
  user-select: none;
  cursor: pointer;
  letter-spacing: 0.5px;
`;

const SwitchTrack = styled.button<{ checked: boolean }>`
  position: relative;
  width: 46px;
  height: 24px;
  border-radius: 9999px;
  border: 2px solid #0e1116;
  background: ${({ checked }) => (checked ? '#2e7def' : '#ffd166')};
  cursor: pointer;
  padding: 0;
  box-shadow: 2px 2px 0 #0e1116;
  transition: background 0.3s ease;

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #0e1116;
  }
`;

const SwitchHandle = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 1px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #0e1116;
  transform: ${({ checked }) => (checked ? 'translateX(22px)' : 'translateX(0)')};
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
`;

/* ============================================
   3D 翻转场景
   ============================================ */
const FlipScene = styled.div`
  perspective: 1200px;
  width: 100%;
`;

const FlipInner = styled.div<{ flipped: boolean }>`
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform: ${({ flipped }) => (flipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

/* ============================================
   卡片面（正面 / 背面共用样式）
   ============================================ */
const CardFace = styled.div`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  box-shadow: 0 25px 60px rgba(14, 17, 22, 0.2);
  padding: 28px 28px 24px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 24px 20px 20px;
  }
`;

const CardFront = styled(CardFace)`
  /* 正面 */
`;

const CardBack = styled(CardFace)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: rotateY(180deg);
`;

/* ============================================
   内容区
   ============================================ */
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
  margin: 0 0 24px 0;
  text-align: center;
`;

/* ============================================
   头像选择区
   ============================================ */
const AvatarRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

const AvatarButton = styled.button<{ selected: boolean }>`
  position: relative;
  width: 52px;
  height: 52px;
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
  width: 52px;
  height: 52px;
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
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #0e1116;
  background: #f9fafb;
  border: 1px solid #e3e8ee;
  border-radius: 14px;
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
const SubmitButton = styled.button<{ disabled: boolean; variant?: 'visitor' | 'friend' }>`
  width: 100%;
  padding: 13px;
  font-size: 16px;
  font-weight: 800;
  border: none;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  font-family: inherit;

  background: ${({ disabled, variant }) =>
    disabled ? '#f3f4f6' : variant === 'friend' ? '#2e7def' : '#0e1116'};
  color: ${({ disabled }) => (disabled ? '#9ca3af' : '#ffffff')};

  ${({ disabled }) =>
    !disabled &&
    css`
      box-shadow: 0 8px 24px rgba(14, 17, 22, 0.2);

      &:hover {
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
  margin-top: 20px;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`;

/* ============================================
   邮箱+验证码行
   ============================================ */
const EmailCodeRow = styled.div`
  display: flex;
  gap: 8px;
`;

const CodeInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #0e1116;
  background: #f9fafb;
  border: 1px solid #e3e8ee;
  border-radius: 14px;
  outline: none;
  transition: all 0.15s ease;
  box-sizing: border-box;
  font-family: inherit;
  text-align: center;
  letter-spacing: 4px;

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
    letter-spacing: 0;
  }

  &:focus {
    background: #ffffff;
    border-color: #2e7def;
    box-shadow: 0 0 0 4px rgba(46, 125, 239, 0.1);
  }
`;

const SendCodeButton = styled.button<{ disabled: boolean; sent: boolean }>`
  flex-shrink: 0;
  width: 110px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid #e3e8ee;
  border-radius: 14px;
  background: ${({ sent }) => (sent ? '#f3f4f6' : '#f9fafb')};
  color: ${({ disabled, sent }) => (sent ? '#9ca3af' : disabled ? '#cbd5e1' : '#2e7def')};
  cursor: ${({ disabled, sent }) => (disabled || sent ? 'not-allowed' : 'pointer')};
  transition: all 0.15s ease;
  font-family: inherit;
  white-space: nowrap;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    ${({ disabled, sent }) =>
      !disabled && !sent
        ? css`
            background: #eff6ff;
            border-color: #2e7def;
          `
        : null}
  }
`;

/* ============================================
   分隔线
   ============================================ */
const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0 14px;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e3e8ee;
  }
`;

/* ============================================
   GitHub 登录按钮
   ============================================ */
const GithubButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 13px;
  font-size: 15px;
  font-weight: 700;
  border: 1px solid #e3e8ee;
  border-radius: 14px;
  background: #ffffff;
  color: #0e1116;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.2s ease;
  font-family: inherit;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    ${({ disabled }) =>
      !disabled
        ? css`
            background: #0e1116;
            color: #ffffff;
            border-color: #0e1116;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(14, 17, 22, 0.15);
          `
        : null}
  }

  &:active {
    ${({ disabled }) => !disabled && 'transform: translateY(0) scale(0.98);'}
  }
`;

/* ============================================
   Toast 提示（Alert 卡片样式 — 四种类型）
   ============================================ */
type ToastType = 'success' | 'info' | 'warning' | 'error';

const toastIn = keyframes`
  from { opacity: 0; transform: translateY(-100%); }
  to   { opacity: 1; transform: translateY(0); }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
`;

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; color: string; icon: string }> = {
  success: { bg: '#dcfce7', border: '#22c55e', color: '#166534', icon: '#16a34a' },
  info:    { bg: '#dbeafe', border: '#3b82f6', color: '#1e40af', icon: '#2563eb' },
  warning: { bg: '#fef9c3', border: '#eab308', color: '#854d0e', icon: '#ca8a04' },
  error:   { bg: '#fee2e2', border: '#ef4444', color: '#991b1b', icon: '#dc2626' },
};

const ToastMessage = styled.div<{ type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ type }) => TOAST_STYLES[type].bg};
  border-left: 4px solid ${({ type }) => TOAST_STYLES[type].border};
  border-radius: 8px;
  color: ${({ type }) => TOAST_STYLES[type].color};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  animation: ${toastIn} 0.4s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: ${({ type }) => TOAST_STYLES[type].icon};
  }
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
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 3px solid #0e1116;
  overflow: hidden;
  margin-bottom: 20px;
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
export interface LoginResult {
  mode: 'visitor' | 'friend';
  username?: string;
  avatarUrl?: string;
  email?: string;
}

interface LoginCardProps {
  onClose: () => void;
  onSuccess: (result: LoginResult) => void;
  initial?: LoginResult | null;
}

export default function LoginCard({ onClose, onSuccess, initial }: LoginCardProps) {
  const [isFriend, setIsFriend] = useState(
    initial?.mode === 'friend' || savedIsFriend
  );

  // Visitor 面状态
  const [visitorName, setVisitorName] = useState(
    initial?.mode === 'visitor' ? initial.username : ''
  );
  const [visitorAvatars, setVisitorAvatars] = useState(
    initial?.mode === 'visitor' && initial.avatarUrl
      ? [...DEFAULT_AVATARS, { id: DEFAULT_AVATARS.length, url: initial.avatarUrl }]
      : DEFAULT_AVATARS
  );
  const [visitorAvatar, setVisitorAvatar] = useState(
    initial?.mode === 'visitor' && initial.avatarUrl
      ? DEFAULT_AVATARS.length
      : 0
  );

  // Friend 面状态
  const [friendEmail, setFriendEmail] = useState(
    initial?.mode === 'friend' ? initial.email || savedFriendEmail : savedFriendEmail
  );
  const [friendCode, setFriendCode] = useState('');
  const [codeSent, setCodeSent] = useState(codeSentTimestamp !== null);
  const [codeCooldown, setCodeCooldown] = useState(() => {
    if (codeSentTimestamp === null) return 0;
    const elapsed = Math.floor((Date.now() - codeSentTimestamp) / 1000);
    return Math.max(0, 60 - elapsed);
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewTarget, setPreviewTarget] = useState<'visitor' | 'friend'>('visitor');
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: ToastType }[]>([]);
  const [closing, setClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastIdRef = useRef(0);

  // 显示提示（3秒后自动消失，支持堆叠）
  const showToast = (msg: string, type: ToastType = 'info') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // 邮箱格式校验：x@x.x
  const isEmailValid = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ESC 关闭 + 锁定背景滚动
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEsc);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = originalOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 倒计时计时器（挂载时如果有剩余倒计时则继续）
  useEffect(() => {
    if (codeCooldown <= 0) return;
    const timer = setInterval(() => {
      if (codeSentTimestamp === null) {
        setCodeCooldown(0);
        return;
      }
      const elapsed = Math.floor((Date.now() - codeSentTimestamp) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setCodeCooldown(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    // 保存当前状态（供下次打开时恢复）
    savedIsFriend = isFriend;
    savedFriendEmail = friendEmail;
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
      if (previewTarget === 'visitor') {
        const newId = visitorAvatars.length;
        setVisitorAvatars([...visitorAvatars, { id: newId, url: previewImage }]);
        setVisitorAvatar(newId);
      }
      setPreviewImage(null);
    }
  };

  // 发送验证码 + 倒计时
  const [codeSending, setCodeSending] = useState(false);
  const handleSendCode = async () => {
    if (!isEmailValid(friendEmail) || codeCooldown > 0 || codeSending) return;
    setCodeSending(true);
    try {
      const res = await fetch('/api/send-code.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: friendEmail }),
      });
      const data = await res.json();
      if (data.success) {
        codeSentTimestamp = Date.now();
        setCodeSent(true);
        setCodeCooldown(60);
        showToast('验证码已发送，请查收邮箱', 'success');
        const timer = setInterval(() => {
          if (codeSentTimestamp === null) {
            setCodeCooldown(0);
            clearInterval(timer);
            return;
          }
          const elapsed = Math.floor((Date.now() - codeSentTimestamp) / 1000);
          const remaining = Math.max(0, 60 - elapsed);
          setCodeCooldown(remaining);
          if (remaining <= 0) {
            clearInterval(timer);
          }
        }, 1000);
      } else {
        showToast(data.message || '发送失败，请重试', 'error');
      }
    } catch {
      showToast('网络错误，请检查连接', 'error');
    } finally {
      setCodeSending(false);
    }
  };

  // GitHub 登录（暂未开放）
  const handleGithubLogin = () => {
    if (loading) return;
    showToast('功能暂未开放', 'warning');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (isFriend) {
      if (!isEmailValid(friendEmail) || !friendCode) return;
      setLoading(true);
      try {
        const res = await fetch('/api/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: friendEmail, code: friendCode }),
        });
        const data = await res.json();
        if (data.success) {
          setClosing(true);
          // 清除保存的状态
          savedIsFriend = false;
          savedFriendEmail = '';
          codeSentTimestamp = null;
          const result: LoginResult = {
            mode: 'friend',
            username: data.data.nickname,
            avatarUrl: data.data.avatar_url,
            email: friendEmail,
          };
          setTimeout(() => onSuccess(result), 200);
        } else {
          showToast(data.message || '登录失败，请重试', 'error');
        }
      } catch {
        showToast('网络错误，请检查连接', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      if (!visitorName) return;
      setLoading(true);
      setTimeout(() => {
        setClosing(true);
        // 清除保存的状态
        savedIsFriend = false;
        savedFriendEmail = '';
        codeSentTimestamp = null;
        const result: LoginResult = {
          mode: 'visitor',
          username: visitorName,
          avatarUrl: visitorAvatars[visitorAvatar]?.url || '',
        };
        setTimeout(() => onSuccess(result), 200);
      }, 1000);
    }
  };

  return createPortal(
    <>
      <Overlay closing={closing}>
        <CardShell>
        {/* 3D 翻转场景 */}
        <FlipScene>
          <FlipInner flipped={isFriend}>

            {/* ========== 正面：Visitor ========== */}
            <CardFront>
              <CloseButton onClick={handleClose}>
                <X />
              </CloseButton>

              {/* 上传预览 */}
              {previewImage && previewTarget === 'visitor' && (
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

              {/* 切换开关 */}
              <ToggleHeader>
                <ModeText active={!isFriend} onClick={() => setIsFriend(false)}>
                  Visitor
                </ModeText>
                <SwitchTrack checked={isFriend} onClick={() => setIsFriend(!isFriend)}>
                  <SwitchHandle checked={isFriend} />
                </SwitchTrack>
                <ModeText active={isFriend} onClick={() => setIsFriend(true)}>
                  Friend
                </ModeText>
              </ToggleHeader>

              <Headline>欢迎来访！</Headline>
              <Subheadline>选择形象并输入昵称</Subheadline>

              <AvatarRow>
                {visitorAvatars.map((avatar) => (
                  <AvatarButton
                    key={avatar.id}
                    selected={visitorAvatar === avatar.id}
                    onClick={() => setVisitorAvatar(avatar.id)}
                  >
                    <img src={avatar.url} alt="avatar" />
                  </AvatarButton>
                ))}
                <UploadButton onClick={() => { setPreviewTarget('visitor'); fileInputRef.current?.click(); }}>
                  <Plus />
                </UploadButton>
              </AvatarRow>

              <Form onSubmit={handleLogin}>
                <FieldGroup>
                  <FieldLabel>
                    <User />
                    用户姓名
                  </FieldLabel>
                  <TextInput
                    type="text"
                    value={visitorName}
                    placeholder="在此输入您的昵称..."
                    maxLength={13}
                    onChange={(e) => setVisitorName(e.target.value.replace(/\s/g, ''))}
                  />
                </FieldGroup>
                <SubmitButton type="submit" disabled={!visitorName || loading} variant="visitor">
                  <span>{loading ? '同步中...' : '同步身份并登录'}</span>
                  {!loading && <ArrowRight />}
                </SubmitButton>
              </Form>

              <Footer>Visitor Mode</Footer>
            </CardFront>

            {/* ========== 背面：Friend ========== */}
            <CardBack>
              <CloseButton onClick={handleClose}>
                <X />
              </CloseButton>

              {/* 切换开关 */}
              <ToggleHeader>
                <ModeText active={!isFriend} onClick={() => setIsFriend(false)}>
                  Visitor
                </ModeText>
                <SwitchTrack checked={isFriend} onClick={() => setIsFriend(!isFriend)}>
                  <SwitchHandle checked={isFriend} />
                </SwitchTrack>
                <ModeText active={isFriend} onClick={() => setIsFriend(true)}>
                  Friend
                </ModeText>
              </ToggleHeader>

              <Headline>好友登录</Headline>
              <Subheadline>使用邮箱验证码或 GitHub 登录</Subheadline>

              <Form onSubmit={handleLogin}>
                <FieldGroup>
                  <FieldLabel>
                    <Mail />
                    邮箱地址
                  </FieldLabel>
                  <TextInput
                    type="email"
                    value={friendEmail}
                    placeholder="your@email.com"
                    onChange={(e) => setFriendEmail(e.target.value.replace(/\s/g, ''))}
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel>
                    <ShieldCheck />
                    验证码
                  </FieldLabel>
                  <EmailCodeRow>
                    <CodeInput
                      type="text"
                      value={friendCode}
                      placeholder="输入验证码"
                      maxLength={6}
                      onChange={(e) => setFriendCode(e.target.value.replace(/\D/g, ''))}
                    />
                    <SendCodeButton
                      type="button"
                      disabled={!isEmailValid(friendEmail) || codeSending}
                      sent={codeCooldown > 0}
                      onClick={handleSendCode}
                    >
                      {codeSending ? '发送中...' : codeCooldown > 0 ? `${codeCooldown}s` : codeSent ? '重新发送' : '发送验证码'}
                    </SendCodeButton>
                  </EmailCodeRow>
                </FieldGroup>
                <SubmitButton type="submit" disabled={!isEmailValid(friendEmail) || !friendCode || loading} variant="friend">
                  <span>{loading ? '登录中...' : '验证并登录'}</span>
                  {!loading && <ArrowRight />}
                </SubmitButton>
              </Form>

              <Divider>或</Divider>

              <GithubButton type="button" onClick={handleGithubLogin} disabled={loading}>
                <Github />
                <span>使用 GitHub 登录</span>
              </GithubButton>

              <Footer>Friend Mode</Footer>
            </CardBack>

          </FlipInner>
        </FlipScene>

        <HiddenInput
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
        />
        </CardShell>
      </Overlay>

      {/* Toast 容器（固定在页面顶部，支持堆叠） */}
      {toasts.length > 0 && (
        <ToastContainer>
          {toasts.map((t) => (
            <ToastMessage key={t.id} type={t.type}>
              <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              {t.msg}
            </ToastMessage>
          ))}
        </ToastContainer>
      )}
    </>,
    document.body
  );
}
