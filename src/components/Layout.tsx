/**
 * 页面布局组件 - 导航栏 + 双栏内容（左侧页面 + 右侧共享侧边栏）
 * 所有页面共享右侧栏：ProfileCard + CalendarCard
 * 左侧内容切换动画：旧内容向下抽离 → 新内容从下方推入
 */

import { useState, useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { PageContainer } from '../pages/PageContainer';
import Navbar from '../components/Navbar';
import BackToTop from '../components/BackToTop';
import ProfileCard from '../components/ProfileCard';
import CalendarCard from '../components/CalendarCard';

/* 旧内容向下抽离 */
const pageExit = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(40px); }
`;

/* 新内容从下方推入 */
const pageEnter = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const LayoutContent = styled.div`
  width: 100%;
  padding: ${theme.spacing.xl} 40px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: ${theme.spacing.xl};
  align-items: start;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    padding: ${theme.spacing['2xl']} ${theme.spacing.md};
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-width: 0;
  overflow: hidden;
`;

const AnimatedWrapper = styled.div<{ phase: 'entering' | 'exiting' }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  animation: ${({ phase }) => (phase === 'exiting' ? pageExit : pageEnter)}
    0.35s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  align-self: stretch;
`;

/* 只有日历卡片触顶固定 */
const CalendarSticky = styled.div`
  position: sticky;
  top: 88px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: static;
  }
`;

export default function Layout() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  const [phase, setPhase] = useState<'entering' | 'exiting'>('entering');
  const [renderedOutlet, setRenderedOutlet] = useState(currentOutlet);
  const committedPath = useRef(location.pathname);

  // 路由变化时启动退出动画
  useEffect(() => {
    if (location.pathname !== committedPath.current) {
      setPhase('exiting');
    }
  }, [location.pathname]);

  // 退出动画结束后，切换到新内容并播放进入动画
  const handleAnimationEnd = (e: React.AnimationEvent) => {
    // 只响应 wrapper 自身的动画结束，忽略子元素的冒泡
    if (e.target !== e.currentTarget) return;
    if (phase === 'exiting') {
      setRenderedOutlet(currentOutlet);
      committedPath.current = location.pathname;
      setPhase('entering');
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <LayoutContent>
          <LeftColumn>
            <AnimatedWrapper phase={phase} onAnimationEnd={handleAnimationEnd}>
              {renderedOutlet}
            </AnimatedWrapper>
          </LeftColumn>
          <RightColumn>
            <ProfileCard />
            <CalendarSticky>
              <CalendarCard />
            </CalendarSticky>
          </RightColumn>
        </LayoutContent>
      </PageContainer>
      <BackToTop />
    </>
  );
}
