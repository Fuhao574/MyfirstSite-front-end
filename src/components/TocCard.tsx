/**
 * 博客目录卡片（Table of Contents）
 * 参考 fuwari 主题实现：
 * - 卡片高度受外层 StickyCard 限制，列表区域填满剩余空间并内部滚动
 * - 选中标题由一个框（indicator）包裹，框随选中项平滑移动
 * - scroll 事件检测当前章节
 * - 点击跳转 + TOC 自身滚动保持活跃项可见
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { List } from 'lucide-react';

const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

/* 卡片整体：flex 列布局，高度 100% 填满 StickyCard */
const TocContainer = styled.div`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  box-shadow: ${theme.card.shadow};
  animation: ${cardEnter} 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: hidden;
`;

const TocHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  padding: 16px 22px 12px;
  border-bottom: 1px solid #f0f3f7;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.accentBlue};
  }
`;

/* TOC 列表容器：flex: 1 填满剩余空间，内部滚动 */
const TocList = styled.nav`
  position: relative;
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px 12px;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 10px;
  }
`;

/* 选中框 indicator — 绝对定位，平滑移动到选中项位置 */
const ActiveIndicator = styled.div<{ top: number; height: number; visible: boolean }>`
  position: absolute;
  left: 8px;
  right: 8px;
  top: ${({ top }) => `${top}px`};
  height: ${({ height }) => `${height}px`};
  border-radius: 10px;
  background: ${theme.colors.accentBlue}0F;
  border: 1.5px solid ${theme.colors.accentBlue}30;
  transition: top 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0),
              height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0),
              opacity 0.2s ease;
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  pointer-events: none;
  z-index: 0;
`;

const TocItem = styled.button<{ level: number; active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  width: 100%;
  padding: 7px 12px;
  padding-left: ${({ level }) => (level === 3 ? '28px' : '12px')};
  font-size: 14px;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  color: ${({ active }) => (active ? theme.colors.accentBlue : theme.colors.textSecondary)};
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.2s ease;
  line-height: 1.4;
  overflow: hidden;
  font-family: inherit;
  position: relative;
  z-index: 1;
  max-width: 100%;

  span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
  }

  &:hover {
    color: ${theme.colors.accentBlue};
  }
`;

const TocDot = styled.span<{ level: number; active: boolean }>`
  width: ${({ level }) => (level === 2 ? '6px' : '4px')};
  height: ${({ level }) => (level === 2 ? '6px' : '4px')};
  border-radius: 50%;
  background: ${({ active }) => (active ? theme.colors.accentBlue : '#cbd5e1')};
  flex-shrink: 0;
  transition: all 0.2s ease;
`;

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

const NAVBAR_OFFSET = 96;

export default function TocCard() {
  const [headings, setHeadings] = useState<HeadingInfo[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [indicator, setIndicator] = useState({ top: 0, height: 0, visible: false });
  const tocListRef = useRef<HTMLElement>(null);
  const anchorNavTarget = useRef<string | null>(null);

  // 更新 indicator 位置（用 offsetTop，不受滚动影响，避免跳帧）
  const updateIndicator = useCallback(() => {
    if (!tocListRef.current) return;
    const activeEl = tocListRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (!activeEl) {
      setIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }
    setIndicator({
      top: activeEl.offsetTop,
      height: activeEl.offsetHeight,
      visible: true,
    });
  }, []);

  // 从 DOM 中提取标题
  const initHeadings = useCallback(() => {
    const content = document.querySelector('.article-content');
    if (!content) {
      setHeadings([]);
      return;
    }

    const els = content.querySelectorAll('h2, h3');
    const items: HeadingInfo[] = [];

    els.forEach((el, idx) => {
      const text = el.textContent || '';
      const level = el.tagName === 'H2' ? 2 : 3;
      const id = el.id || `toc-heading-${idx}`;
      el.id = id;
      items.push({ id, text, level, element: el as HTMLElement });
    });

    setHeadings(items);
    if (items.length > 0) {
      setActiveId(items[0].id);
    }
  }, []);

  // 初始化
  useEffect(() => {
    const timer = setTimeout(initHeadings, 150);
    return () => clearTimeout(timer);
  }, [initHeadings]);

  // 初始化后更新 indicator
  useEffect(() => {
    if (activeId) {
      requestAnimationFrame(updateIndicator);
    }
  }, [activeId, updateIndicator]);

  // scroll 检测当前章节
  useEffect(() => {
    if (headings.length === 0) return;

    const updateActive = () => {
      let activeIndex = 0;
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].element.getBoundingClientRect().top <= NAVBAR_OFFSET) {
          activeIndex = i;
        } else {
          break;
        }
      }

      const newActiveId = headings[activeIndex].id;

      // 点击跳转锁定：在目标标题到达顶部之前，不更新 activeId
      if (anchorNavTarget.current) {
        const targetEl = document.getElementById(anchorNavTarget.current);
        if (targetEl && targetEl.getBoundingClientRect().top <= NAVBAR_OFFSET) {
          // 目标已越过导航栏线，解除锁定
          anchorNavTarget.current = null;
        } else {
          // 锁定期间不做任何更新，避免 indicator 跳回旧标题
          return;
        }
      }

      setActiveId(newActiveId);

      // TOC 自身滚动，保持活跃项可见
      if (tocListRef.current) {
        const activeEl = tocListRef.current.querySelector('[data-active="true"]') as HTMLElement;
        if (activeEl) {
          const listRect = tocListRef.current.getBoundingClientRect();
          const itemRect = activeEl.getBoundingClientRect();
          const PADDING = 8;
          const isVisible =
            itemRect.top >= listRect.top + PADDING &&
            itemRect.bottom <= listRect.bottom - PADDING;

          if (!isVisible) {
            const top =
              itemRect.bottom > listRect.bottom - PADDING
                ? activeEl.offsetTop - tocListRef.current.clientHeight + itemRect.height + PADDING
                : activeEl.offsetTop - PADDING;
            tocListRef.current.scrollTo({ top, behavior: 'smooth' });
          }
        }
      }
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    updateActive();

    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [headings]);

  // 点击跳转
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      anchorNavTarget.current = id;
      setActiveId(id);
      const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET + 4;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <TocContainer>
      <TocHeader>
        <List />
        目录
      </TocHeader>
      <TocList ref={tocListRef}>
        <ActiveIndicator
          top={indicator.top}
          height={indicator.height}
          visible={indicator.visible}
        />
        {headings.map((h) => (
          <TocItem
            key={h.id}
            level={h.level}
            active={activeId === h.id}
            data-active={activeId === h.id}
            onClick={() => handleClick(h.id)}
          >
            <TocDot level={h.level} active={activeId === h.id} />
            <span>{h.text}</span>
          </TocItem>
        ))}
      </TocList>
    </TocContainer>
  );
}
