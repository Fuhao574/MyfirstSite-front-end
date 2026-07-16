/**
 * 页面布局组件 - 导航栏 + 内容区域
 * 主页/博客/项目/归档/友链：双栏（左侧内容 + 右侧共享侧边栏）
 * 关于页面：全宽（无侧边栏）
 * 切换动画：
 *   - 双栏页面之间切换 → 只动画左栏（InnerWrapper），右栏不动
 *   - 涉及关于页面 → 整体抽离/推入（OuterWrapper 动画全部内容）
 *
 * 关键设计：始终使用单一渲染结构（无双分支），OuterWrapper 和 InnerWrapper
 * 始终位于相同 DOM 位置，避免 React 卸载/重建组件导致动画闪烁。
 * - aboutTransition=true 时：OuterWrapper 负责 exit/enter 动画，InnerWrapper idle
 * - aboutTransition=false 时：OuterWrapper idle，InnerWrapper 负责 exit/enter 动画
 */

import { useState, useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { PageContainer } from '../pages/PageContainer';
import Navbar from '../components/Navbar';
import BackToTop from '../components/BackToTop';
import ProfileCard from '../components/ProfileCard';
import CalendarCard from '../components/CalendarCard';
import TocCard from '../components/TocCard';

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

/* 使用 css`` 序列化完整 animation 属性，避免 shorthand 解析歧义：
 * "none" 既是合法 animation-name 又是合法 animation-fill-mode，
 * 用模板字符串拼接时浏览器会把 "none" 匹配为 fill-mode、"both" 匹配为 name。
 * css`` 会把整个 animation 值作为一个 token 输出，绕过此问题。 */
const animStyle = (phase: 'entering' | 'exiting' | 'idle') => {
  if (phase === 'idle') return css`animation: none;`;
  const anim = phase === 'exiting' ? pageExit : pageEnter;
  return css`animation: ${anim} 0.35s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;`;
};

/* 外层动画包裹：About 页面切换时整体动画（含侧边栏） */
const OuterWrapper = styled.div<{ phase: 'entering' | 'exiting' | 'idle' }>`
  width: 100%;
  ${({ phase }) => animStyle(phase)}
`;

/* 内层动画包裹：双栏页面之间切换时仅动画左栏 */
const InnerWrapper = styled.div<{ phase: 'entering' | 'exiting' | 'idle' }>`
  width: 100%;
  ${({ phase }) => animStyle(phase)}
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

/* 右侧栏：拉伸到和左栏一样高，给 sticky 足够空间 */
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  /* 关键：让右栏高度跟随左栏（文章），sticky 才有足够空间 */
  align-self: stretch;
  min-height: 100%;
`;

/* 第二个卡片 sticky 置顶（ProfileCard 正常滚动） */
const StickyCard = styled.div`
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 96px);

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: static;
    max-height: none;
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

export default function Layout() {
  const location = useLocation();
  const currentOutlet = useOutlet();

  const [phase, setPhase] = useState<'entering' | 'exiting'>('entering');
  const [renderedOutlet, setRenderedOutlet] = useState(currentOutlet);
  const committedPath = useRef(location.pathname);
  // 记录当前过渡类型，整个过渡期间（exit+enter）保持不变
  const transitionTypeRef = useRef<'left-only' | 'about'>('left-only');

  // 同步检测路由变化：在渲染期间设置 phase='exiting' 和过渡类型
  // React 会丢弃本次渲染输出并立即用新 state 重新渲染，浏览器不会看到旧状态
  if (location.pathname !== committedPath.current) {
    const oldAbout = committedPath.current === '/about';
    const newAbout = location.pathname === '/about';
    transitionTypeRef.current = (oldAbout || newAbout) ? 'about' : 'left-only';
    if (phase === 'entering') {
      setPhase('exiting');
    }
  }

  // 路由变化时滚动到顶部（放在 useEffect 中避免布局抖动）
  useEffect(() => {
    if (location.pathname !== committedPath.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const committedPathStr = committedPath.current;
  const showFullLayout = committedPathStr === '/about';

  // 博客详情页：路径匹配 /blog/:postId（但不匹配 /blog 本身）
  const isBlogDetail = /^\/blog\/[^/]+/.test(committedPathStr);

  // 当前过渡是否涉及 About 页面（整个过渡期间不变）
  const aboutTransition = transitionTypeRef.current === 'about';

  // 右侧栏内容：博客详情页显示 TocCard（替代 CalendarCard），其他页面显示 CalendarCard
  const sidebarContent = isBlogDetail ? (
    <>
      <ProfileCard />
      <StickyCard>
        <TocCard />
      </StickyCard>
    </>
  ) : (
    <>
      <ProfileCard />
      <StickyCard>
        <CalendarCard />
      </StickyCard>
    </>
  );

  return (
    <>
      <Navbar />
      <PageContainer>
        {/*
         * 单一渲染结构：OuterWrapper 始终在同一 DOM 位置，不会因分支切换而重建。
         * - aboutTransition=true: Outer 负责 exit/enter，Inner idle
         * - aboutTransition=false: Outer idle，Inner 负责 exit/enter
         */}
        <OuterWrapper
          phase={aboutTransition ? phase : 'idle'}
          onAnimationEnd={aboutTransition ? handleAnimationEnd : undefined}
        >
          {showFullLayout ? (
            <FullLayout>
              {renderedOutlet}
            </FullLayout>
          ) : (
            <DualLayout>
              <LeftColumn>
                <InnerWrapper
                  phase={aboutTransition ? 'idle' : phase}
                  onAnimationEnd={aboutTransition ? undefined : handleAnimationEnd}
                >
                  {renderedOutlet}
                </InnerWrapper>
              </LeftColumn>
              <RightColumn>
                {sidebarContent}
              </RightColumn>
            </DualLayout>
          )}
        </OuterWrapper>
      </PageContainer>
      <BackToTop />
    </>
  );
}
