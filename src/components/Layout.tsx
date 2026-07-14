/**
 * 页面布局组件 - 导航栏 + 双栏内容（左侧页面 + 右侧共享侧边栏）
 * 所有页面共享右侧栏：ProfileCard + CalendarCard
 */

import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { PageContainer } from '../pages/PageContainer';
import Navbar from '../components/Navbar';
import BackToTop from '../components/BackToTop';
import ProfileCard from '../components/ProfileCard';
import CalendarCard from '../components/CalendarCard';

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
  return (
    <>
      <Navbar />
      <PageContainer>
        <LayoutContent>
          <LeftColumn>
            <Outlet />
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
