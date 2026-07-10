/**
 * 主页 - 组件化布局
 * 左侧：今天吃什么 + 天气 + 占位卡片
 * 右侧：个人介绍（正常滚动）+ 日历（触顶固定）
 * 移动端：自动堆叠为单列
 */

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { PageContainer } from './PageContainer';
import FoodSlotMachine from '../components/FoodSlotMachine';
import WeatherCard from '../components/WeatherCard';
import ProfileCard from '../components/ProfileCard';
import CalendarCard from '../components/CalendarCard';

const placeholderEnter = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// @ts-expect-error -- used in CSS animation reference
const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const PlaceholderCard = styled.div<{ delay?: number }>`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  padding: ${theme.card.padding};
  box-shadow: ${theme.card.shadow};
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  animation: ${placeholderEnter} 0.5s ${({ delay = 0 }) => `${delay * 0.1}s`} cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.card.shadowHover};
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: ${theme.colors.textPrimary};
    margin: 0;
  }

  p {
    font-size: 14px;
    color: ${theme.colors.textSecondary};
    margin: 0;
    line-height: 1.6;
  }

  .skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: ${theme.spacing.sm};
  }

  .skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f3f6fa 25%, #e3e8ee 50%, #f3f6fa 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-line:nth-child(1) { width: 100%; }
  .skeleton-line:nth-child(2) { width: 85%; }
  .skeleton-line:nth-child(3) { width: 70%; }
`;

const HomeContent = styled.div`
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

export default function Home() {
  return (
    <PageContainer>
      <HomeContent>
        <LeftColumn>
          <FoodSlotMachine />
          <WeatherCard />

          <PlaceholderCard delay={1}>
            <h3>最新文章</h3>
            <p>这里将来会展示最新发布的博客文章列表</p>
            <div className="skeleton-lines">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </PlaceholderCard>

          <PlaceholderCard delay={2}>
            <h3>热门项目</h3>
            <p>这里将来会展示 GitHub 热门项目</p>
            <div className="skeleton-lines">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </PlaceholderCard>

          <PlaceholderCard delay={3}>
            <h3>随机一言</h3>
            <p>「Stay hungry, stay foolish.」 — Steve Jobs</p>
            <div className="skeleton-lines">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </PlaceholderCard>

          <PlaceholderCard delay={4}>
            <h3>网站统计</h3>
            <p>总访问量、文章数、运行天数等统计数据</p>
            <div className="skeleton-lines">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </PlaceholderCard>
        </LeftColumn>
        <RightColumn>
          <ProfileCard />
          <CalendarSticky>
            <CalendarCard />
          </CalendarSticky>
        </RightColumn>
      </HomeContent>
    </PageContainer>
  );
}
