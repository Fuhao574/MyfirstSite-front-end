/**
 * 页面布局组件 - 导航栏 + 内容区域
 * 主页/博客/项目/归档/友链：双栏（左侧内容 + 右侧共享侧边栏）
 * 关于页面：全宽（无侧边栏）
 * 切换动画：
 *   - 双栏页面之间切换 → 只动画左栏，右栏不动
 *   - 涉及关于页面 → 整体抽离/推入（右栏出现/消失）
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

/* 动画包裹层 */
const AnimatedWrapper = styled.div<{ phase: 'entering' | 'exiting' }>`
  width: 100%;
  animation: ${({ phase }) => (phase === 'exiting' ? pageExit : pageEnter)}
    0.35s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
`;

/* 双栏布局（含右侧栏） */
const DualLayout = styled.div`
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

/* 全宽布局（关于页面） */
const FullLayout = styled.div`
  width: 100%;
  padding: ${theme.spacing.xl} 40px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.md};
  }
`;

/* 右侧栏（静态，不参与左栏切换动画） */
const StaticSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
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
    if (e.target !== e.currentTarget) return;
    if (phase === 'exiting') {
      setRenderedOutlet(currentOutlet);
      committedPath.current = location.pathname;
      setPhase('entering');
    }
  };

  // 用 committedPath 决定布局（退出阶段保持旧布局，进入阶段用新布局）
  const showFullLayout = committedPath.current === '/about';

  // 判断是否是双栏页面之间的切换（新旧路径都不是 /about）
  const oldIsAbout = committedPath.current === '/about';
  const newIsAbout = location.pathname === '/about';
  const animateLeftOnly = !oldIsAbout && !newIsAbout;

  // 右侧栏内容（静态，不参与动画）
  const sidebar = (
    <RightColumn>
      <ProfileCard />
      <CalendarSticky>
        <CalendarCard />
      </CalendarSticky>
    </RightColumn>
  );

  if (animateLeftOnly) {
    // 双栏页面之间切换：只动画左栏，右栏不动
    return (
      <>
        <Navbar />
        <PageContainer>
          <DualLayout>
            <LeftColumn>
              <AnimatedWrapper phase={phase} onAnimationEnd={handleAnimationEnd}>
                {renderedOutlet}
              </AnimatedWrapper>
            </LeftColumn>
            <StaticSidebar>
              <ProfileCard />
              <CalendarSticky>
                <CalendarCard />
              </CalendarSticky>
            </StaticSidebar>
          </DualLayout>
        </PageContainer>
        <BackToTop />
      </>
    );
  }

  // 涉及关于页面：整体动画
  return (
    <>
      <Navbar />
      <PageContainer>
        <AnimatedWrapper phase={phase} onAnimationEnd={handleAnimationEnd}>
          {showFullLayout ? (
            <FullLayout>
              {renderedOutlet}
            </FullLayout>
          ) : (
            <DualLayout>
              <LeftColumn>
                {renderedOutlet}
              </LeftColumn>
              {sidebar}
            </DualLayout>
          )}
        </AnimatedWrapper>
      </PageContainer>
      <BackToTop />
    </>
  );
}
