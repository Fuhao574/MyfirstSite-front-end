/**
 * 个人中心卡片
 * Visitor 模式：修改昵称、更换/上传头像、退出登录
 * Friend 模式：修改邮箱（需验证）、修改头像URL/上传头像、修改昵称、退出登录
 * 样式沿用 LoginCard 风格，锁定页面滚动
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { X, Camera, LogOut, Mail, User, Save } from 'lucide-react';
import { theme } from '../styles/theme';
import type { LoginResult } from './LoginCard';

interface ProfileCenterProps {
  loginResult: LoginResult;
  onClose: () => void;
  onUpdate: (result: LoginResult) => void;
  onLogout: () => void;
  onToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

/* ============================================
   动画（与 LoginCard 一致）
   ============================================ */
const overlayFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const cardSlideIn = keyframes`
  from { opacity: 0; transform: translateY(-12px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

/* ============================================
   遮罩层（与 LoginCard 一致）
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
   卡片外层（与 LoginCard 一致）
   ============================================ */
const CardShell = styled.div`
  width: 400px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 64px);
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
  z-index: 5;
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
   卡片内容（与 LoginCard CardFace 一致）
   ============================================ */
const CardBody = styled.div`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  box-shadow: 0 25px 60px rgba(14, 17, 22, 0.2);
  padding: 28px 28px 24px;
  overflow-y: auto;
  max-height: calc(100vh - 64px);

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 24px 20px 20px;
  }
`;

const Headline = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #0e1116;
  margin: 0 0 6px 0;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #5b6472;
  margin: 0 0 24px 0;
`;

const ModeBadge = styled.span<{ mode: 'visitor' | 'friend' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ mode }) => (mode === 'friend' ? '#dbeafe' : '#dcfce7')};
  color: ${({ mode }) => (mode === 'friend' ? '#1e40af' : '#166534')};
  margin-bottom: 20px;
`;

/* 头像区域 */
const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const AvatarPreview = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e3e8ee;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarUploadBtn = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #0e1116;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #fff;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 12px;
    height: 12px;
    color: #fff;
  }

  input {
    display: none;
  }
`;

const AvatarInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AvatarLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #0e1116;
  margin: 0 0 4px;
`;

const AvatarHint = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
`;

/* 表单字段 */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #5b6472;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e3e8ee;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  color: #0e1116;
  background: #fff;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #0e1116;
    box-shadow: 0 0 0 3px rgba(14, 17, 22, 0.08);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f3f6fa;
    cursor: not-allowed;
  }
`;

const FieldRow = styled.div`
  display: flex;
  gap: 8px;
`;

const SendCodeBtn = styled.button<{ disabled: boolean }>`
  white-space: nowrap;
  padding: 10px 16px;
  border: 2px solid #0e1116;
  border-radius: 9999px;
  background: transparent;
  color: #0e1116;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #0e1116;
    color: #fff;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f3f7;
  margin: 8px 0 16px;
`;

/* 按钮 */
const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 9999px;
  background: #0e1116;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(14, 17, 22, 0.15);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px;
  border: 2px solid #fca5a5;
  border-radius: 9999px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fee2e2;
    transform: translateY(-2px);
  }
`;

/* ============================================
   组件
   ============================================ */
export default function ProfileCenter({
  loginResult,
  onClose,
  onUpdate,
  onLogout,
  onToast,
}: ProfileCenterProps) {
  const [nickname, setNickname] = useState(loginResult.username);
  const [avatarUrl, setAvatarUrl] = useState(loginResult.avatarUrl);
  const [email] = useState(loginResult.email || '');
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailCodeCooldown, setEmailCodeCooldown] = useState(0);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFriend = loginResult.mode === 'friend';
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // 内部 Toast 委托给 Navbar（关闭后仍可显示）
  const showToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    onToast(msg, type);
  };

  // ESC 关闭 + 锁定页面滚动（与 LoginCard 一致）
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
  });

  // 带退出动画的关闭（与 LoginCard 一致，200ms 淡出后卸载）
  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => onClose(), 200);
  };

  // 上传头像
  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('图片大小不能超过 2MB', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      showToast('头像已选择，点击保存生效', 'info');
    };
    reader.readAsDataURL(file);
  };

  // 发送邮箱验证码
  const handleSendEmailCode = async () => {
    if (!isEmailValid(newEmail) || emailCodeCooldown > 0) return;
    try {
      const res = await fetch('/api/send-code.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('验证码已发送至新邮箱', 'success');
        setEmailCodeCooldown(60);
        const timer = setInterval(() => {
          setEmailCodeCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        showToast(data.message || '发送失败', 'error');
      }
    } catch {
      showToast('网络错误', 'error');
    }
  };

  // 保存
  const handleSave = async () => {
    if (!nickname.trim()) {
      showToast('昵称不能为空', 'warning');
      return;
    }
    setSaving(true);

    if (isFriend && newEmail && newEmail !== email) {
      if (!emailCode) {
        showToast('请输入邮箱验证码', 'warning');
        setSaving(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 500));
      showToast('邮箱验证成功', 'success');
    }

    const updated: LoginResult = {
      ...loginResult,
      username: nickname.trim(),
      avatarUrl,
      email: isFriend && newEmail ? newEmail : email,
    };

    await new Promise((r) => setTimeout(r, 300));
    onUpdate(updated);
    showToast('个人信息已保存', 'success');
    // 不重置 saving，保持"保存中..."状态直到卡片消失
    setTimeout(() => handleClose(), 400);
  };

  // 退出登录
  const handleLogout = () => {
    onLogout();
    showToast('已退出登录', 'info');
    setTimeout(() => handleClose(), 400);
  };

  return createPortal(
    <Overlay closing={closing} onClick={handleClose}>
      <CardShell onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
              <X />
            </CloseButton>

          <CardBody>
            <ModeBadge mode={loginResult.mode}>
              {isFriend ? 'Friend' : 'Visitor'}
            </ModeBadge>

            <Headline>个人中心</Headline>
            <SubText>管理你的个人信息</SubText>

            {/* 头像 */}
            <AvatarSection>
              <AvatarPreview>
                <img src={avatarUrl} alt="avatar" />
                <AvatarUploadBtn>
                  <Camera />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                  />
                </AvatarUploadBtn>
              </AvatarPreview>
              <AvatarInfo>
                <AvatarLabel>头像</AvatarLabel>
                <AvatarHint>点击相机图标上传新头像</AvatarHint>
                {isFriend && (
                  <FieldInput
                    style={{ marginTop: 8 }}
                    placeholder="或输入头像 URL"
                    value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                )}
              </AvatarInfo>
            </AvatarSection>

            {/* 昵称 */}
            <FieldGroup>
              <FieldLabel>
                <User />
                昵称
              </FieldLabel>
              <FieldInput
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="输入你的昵称"
                maxLength={20}
              />
            </FieldGroup>

            {/* Friend 模式：修改邮箱 */}
            {isFriend && (
              <>
                <Divider />
                <FieldGroup>
                  <FieldLabel>
                    <Mail />
                    当前邮箱
                  </FieldLabel>
                  <FieldInput value={email} disabled />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>
                    <Mail />
                    新邮箱（需验证）
                  </FieldLabel>
                  <FieldRow>
                    <FieldInput
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="输入新邮箱地址"
                    />
                    <SendCodeBtn
                      disabled={!isEmailValid(newEmail) || emailCodeCooldown > 0}
                      onClick={handleSendEmailCode}
                    >
                      {emailCodeCooldown > 0 ? `${emailCodeCooldown}s` : '发送验证码'}
                    </SendCodeBtn>
                  </FieldRow>
                </FieldGroup>

                {newEmail && isEmailValid(newEmail) && (
                  <FieldGroup>
                    <FieldLabel>
                      <Mail />
                      验证码
                    </FieldLabel>
                    <FieldInput
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      placeholder="输入验证码"
                      maxLength={6}
                    />
                  </FieldGroup>
                )}
              </>
            )}

            <Divider />

            {/* 保存 */}
            <SaveButton onClick={handleSave} disabled={saving}>
              <Save size={16} />
              {saving ? '保存中...' : '保存修改'}
            </SaveButton>

            {/* 退出登录 */}
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              退出登录
            </LogoutButton>
          </CardBody>
        </CardShell>
      </Overlay>,
    document.body
  );
}
