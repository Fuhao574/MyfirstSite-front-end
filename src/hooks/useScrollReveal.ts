/**
 * useScrollReveal — IntersectionObserver 驱动的滚动进入动画 Hook
 * 当元素进入视口时触发动画，只触发一次
 */

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  /** 阈值，0-1，默认 0.15 */
  threshold?: number;
  /** 根边距，默认 '0px 0px -60px 0px'（提前触发） */
  rootMargin?: string;
  /** 是否只触发一次，默认 true */
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 如果已经可见，不需要再观察（once=true）
    if (once && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}