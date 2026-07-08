/**
 * WelcomePage — Doodle 风格登录/注册页
 * 点击 "Let's Go!" 后进入主页
 */

import { useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import Toast from './Toast';

/* 装饰 SVG 浮动动画 */
const floatStar = keyframes`
  0%, 100% { transform: translateY(0) rotate(-15deg); }
  50%      { transform: translateY(-8px) rotate(-10deg); }
`;
const floatSparkle = keyframes`
  0%, 100% { transform: translateY(0) rotate(10deg); }
  50%      { transform: translateY(-8px) rotate(15deg); }
`;
const floatSwirl = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-8px) rotate(5deg); }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  25%      { transform: rotate(2deg); }
  50%      { transform: rotate(-4deg); }
  75%      { transform: rotate(1deg); }
`;

const Wrapper = styled.div`
  --ink: #323232;
  --paper-front: #fff9e6;
  --paper-back: #e6f0ff;
  --bg-color: #ffffff;
  --primary-btn: #ff6b6b;
  --primary-btn-hover: #ff5252;
  --secondary-btn: #4ecdc4;
  --secondary-btn-hover: #3bbfb6;
  --switch-bg: #ffe66d;
  --input-focus: #2d8cf0;

  --card-width: 300px;
  --card-height: 350px;
  --input-width: 250px;
  --input-height: 40px;
  --btn-width: 120px;
  --btn-height: 40px;

  --border-width: 2px;
  --shadow-offset: 4px;

  --sketch-radius-1: 8px 24px 8px 24px / 24px 8px 24px 8px;
  --sketch-radius-2: 24px 8px 24px 8px / 8px 24px 8px 24px;
  --sketch-radius-btn: 16px 5px 16px 5px / 5px 16px 5px 16px;

  font-family: "Comic Sans MS", "Chalkboard SE", "Marker Felt", "Gochi Hand", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  background: ${theme.colors.bgPrimary};
`;

/* ============================================
   Header & Switch
   ============================================ */
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  z-index: 5;
`;

const ModeText = styled.span<{ dim?: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: var(--ink);
  opacity: ${({ dim }) => (dim ? 0.5 : 1)};
  transition: opacity 0.3s;
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  background-color: var(--switch-bg);
  border: var(--border-width) solid var(--ink);
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 2px 2px 0px var(--ink);
  transition: transform 0.1s, box-shadow 0.1s;

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px var(--ink);
  }
`;

const SwitchHandle = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 2px;
  left: 3px;
  width: 16px;
  height: 16px;
  background-color: var(--bg-color);
  border: var(--border-width) solid var(--ink);
  border-radius: 50%;
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: ${({ checked }) => (checked ? 'translateX(24px)' : 'translateX(0)')};
`;

/* ============================================
   装饰 SVG 浮动动画
   ============================================ */
const DecoSvg = styled.svg<{ anim: 'star' | 'sparkle' | 'swirl' }>`
  position: absolute;
  z-index: -1;
  pointer-events: none;
  animation: ${({ anim }) =>
      anim === 'star' ? floatStar : anim === 'sparkle' ? floatSparkle : floatSwirl}
    4s ease-in-out infinite;
  ${({ anim }) =>
    anim === 'star'
      ? 'top: -25px; left: -35px; width: 48px; height: 48px;'
      : anim === 'sparkle'
      ? 'bottom: -20px; right: -25px; width: 40px; height: 40px;'
      : 'top: 30px; right: -30px; width: 32px; height: 32px;'};
  animation-delay: ${({ anim }) =>
    anim === 'sparkle' ? '1s' : anim === 'swirl' ? '2s' : '0s'};
`;

const CardInner = styled.div<{ flipped: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform: ${({ flipped }) => (flipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;

const CardFace = styled.div<{ side: 'front' | 'back' }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  border: var(--border-width) solid var(--ink);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--ink);

  background-image: repeating-linear-gradient(
    transparent,
    transparent 28px,
    rgba(0, 0, 0, 0.06) 28px,
    rgba(0, 0, 0, 0.06) 30px
  );
  background-position: 0 15px;

  ${({ side }) =>
    side === 'front'
      ? `
    background-color: var(--paper-front);
    border-radius: var(--sketch-radius-1);
  `
      : `
    background-color: var(--paper-back);
    transform: rotateY(180deg);
    border-radius: var(--sketch-radius-2);
  `}
`;

const Title = styled.div<{ alt?: boolean }>`
  font-size: 25px;
  font-weight: 900;
  color: var(--ink);
  margin: ${({ alt }) => (alt ? '0px 0 15px 0' : '10px 0 20px 0')};
  text-transform: uppercase;
  letter-spacing: 1px;
  transform: ${({ alt }) => (alt ? 'rotate(2deg)' : 'rotate(-3deg)')};
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  align-items: center;
`;

const Input = styled.input`
  width: var(--input-width);
  height: var(--input-height);
  padding: 5px 15px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  background-color: var(--bg-color);
  border: var(--border-width) solid var(--ink);
  border-radius: var(--sketch-radius-1);
  box-shadow: 3px 3px 0px var(--ink);
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #666;
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 4px 4px 0px var(--ink);
  }

  &:focus,
  &:focus-visible {
    border: var(--border-width) solid var(--input-focus);
    border-radius: var(--sketch-radius-2);
    background-color: #fffdf5;
    box-shadow: 4px 4px 0px var(--ink);
  }
`;

const Btn = styled.button`
  margin: 15px 0;
  width: var(--btn-width);
  height: var(--btn-height);
  font-family: inherit;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
  color: var(--ink);
  border: var(--border-width) solid var(--ink);
  border-radius: var(--sketch-radius-btn);
  box-shadow: 4px 4px 0px var(--ink);
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: ${({ "data-alt": alt }: { "data-alt"?: boolean }) =>
    alt ? 'var(--secondary-btn)' : 'var(--primary-btn)'};
  transform: ${({ "data-alt": alt }: { "data-alt"?: boolean }) =>
    alt ? 'rotate(1deg)' : 'rotate(-1deg)'};

  &:hover {
    background-color: ${({ "data-alt": alt }: { "data-alt"?: boolean }) =>
      alt ? 'var(--secondary-btn-hover)' : 'var(--primary-btn-hover)'};
    transform: ${({ "data-alt": alt }: { "data-alt"?: boolean }) =>
      alt ? 'translateY(-2px) rotate(2deg)' : 'translateY(-2px) rotate(-2deg)'};
    box-shadow: 5px 5px 0px var(--ink);
  }

  &:active {
    transform: translate(3px, 3px) rotate(0deg);
    box-shadow: 0px 0px 0px var(--ink);
  }
`;

/* 标题悬停抖动 */
const CardSceneHover = styled.div`
  position: relative;
  perspective: 1000px;
  width: var(--card-width);
  height: var(--card-height);
  z-index: 2;

  &:hover ${Title} {
    animation: ${wiggle} 0.5s ease-in-out;
  }
`;

/* ============================================
   进入动画
   ============================================ */
const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
`;

const AnimatedContainer = styled.div`
  animation: ${fadeInScale} 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
`;

/* ============================================
   退出动画
   ============================================ */
const fadeOutScale = keyframes`
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(1.05); filter: blur(8px); }
`;

const ExitContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bgPrimary};
  animation: ${fadeOutScale} 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
`;

interface WelcomePageProps {
  onEnter: () => void;
}

export default function WelcomePage({ onEnter }: WelcomePageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleLetGo = (e: React.FormEvent) => {
    e.preventDefault();
    // 先显示登录成功提示
    setShowToast(true);
    // 1.5s 后开始退出动画，让用户看到提示
    setTimeout(() => {
      setShowToast(false);
      setExiting(true);
      // 等待退出动画播放完后调用 onEnter
      setTimeout(() => onEnter(), 500);
    }, 1500);
  };

  // 如果正在退出，渲染退出动画
  if (exiting) {
    return (
      <ExitContainer>
        {showToast && (
          <Toast type="success" message="登录成功！欢迎回来" duration={1200} onClose={() => setShowToast(false)} />
        )}
        <AnimatedContainer>
          <Wrapper>
            <CardSceneHover>
              <DecoSvg anim="star" viewBox="0 0 24 24" fill="#ffd166" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </DecoSvg>
              <DecoSvg anim="sparkle" viewBox="0 0 24 24" fill="#06d6a0" stroke="var(--ink)" strokeWidth="1.5">
                <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z" />
              </DecoSvg>
              <DecoSvg anim="swirl" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 12 C 3 5 10 5 16 5 C 20 5 21 9 18 12 C 15 15 10 13 12 9 C 14 5 22 9 21 16" />
              </DecoSvg>
              <CardInner flipped={isSignup}>
                <CardFace side="front">
                  <Title>Welcome!</Title>
                  <Form onSubmit={handleLetGo}>
                    <Input name="email" placeholder="Email" type="email" required />
                    <Input name="password" placeholder="Password" type="password" required />
                    <Btn type="submit">Let's Go!</Btn>
                  </Form>
                </CardFace>
                <CardFace side="back">
                  <Title alt>Join Us!</Title>
                  <Form onSubmit={handleLetGo}>
                    <Input name="username" placeholder="Name" type="text" required />
                    <Input name="email" placeholder="Email" type="email" required />
                    <Input name="password" placeholder="Password" type="password" required />
                    <Btn type="submit" data-alt>Confirm!</Btn>
                  </Form>
                </CardFace>
              </CardInner>
            </CardSceneHover>
          </Wrapper>
        </AnimatedContainer>
      </ExitContainer>
    );
  }

  return (
    <AnimatedContainer>
      {showToast && (
        <Toast type="success" message="登录成功！欢迎回来" duration={1200} onClose={() => setShowToast(false)} />
      )}
      <Wrapper>
        <Header>
          <ModeText dim={isSignup}>Log in</ModeText>
          <SwitchLabel htmlFor="doodle-flip" tabIndex={0} onClick={() => setIsSignup(!isSignup)}>
            <SwitchHandle checked={isSignup} />
          </SwitchLabel>
          <ModeText dim={!isSignup}>Sign up</ModeText>
        </Header>
        <CardSceneHover>
          <DecoSvg anim="star" viewBox="0 0 24 24" fill="#ffd166" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </DecoSvg>
          <DecoSvg anim="sparkle" viewBox="0 0 24 24" fill="#06d6a0" stroke="var(--ink)" strokeWidth="1.5">
            <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z" />
          </DecoSvg>
          <DecoSvg anim="swirl" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 12 C 3 5 10 5 16 5 C 20 5 21 9 18 12 C 15 15 10 13 12 9 C 14 5 22 9 21 16" />
          </DecoSvg>
          <CardInner flipped={isSignup}>
            <CardFace side="front">
              <Title>Welcome!</Title>
              <Form onSubmit={handleLetGo}>
                <Input name="email" placeholder="Email" type="email" required />
                <Input name="password" placeholder="Password" type="password" required />
                <Btn type="submit">Let's Go!</Btn>
              </Form>
            </CardFace>
            <CardFace side="back">
              <Title alt>Join Us!</Title>
              <Form onSubmit={handleLetGo}>
                <Input name="username" placeholder="Name" type="text" required />
                <Input name="email" placeholder="Email" type="email" required />
                <Input name="password" placeholder="Password" type="password" required />
                <Btn type="submit" data-alt>Confirm!</Btn>
              </Form>
            </CardFace>
          </CardInner>
        </CardSceneHover>
      </Wrapper>
    </AnimatedContainer>
  );
}