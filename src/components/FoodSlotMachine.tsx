/**
 * 今天吃什么 · 食物老虎机组件
 * 渐变背景 + 光斑风格，三列滚动，依次停止，弹跳显示结果
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { UtensilsCrossed, RefreshCw, Sparkles } from 'lucide-react';

/* ============================================
   食物列表
   ============================================ */
const FOODS = [
  '中餐', '日料', '韩餐', '火锅', '烧烤', '快餐', '面食', '米粉',
  '饺子', '炒饭', '披萨', '汉堡', '寿司', '拉面', '麻辣烫', '黄焖鸡',
  '螺蛳粉', '烤肉', '串串香', '冒菜',
];

/* ============================================
   滚动参数
   ============================================ */
const ITEM_HEIGHT = 48;                          // 单个食物项高度(px)
const VISIBLE = 3;                               // 窗口可见项数
const SINGLE = FOODS.length * ITEM_HEIGHT;       // 一圈的像素高度
const REPEATS = 4;                               // reel 渲染重复圈数(保证无缝循环)
const SPIN_SPEED = 0.62;                         // 滚动速度 px/ms
const STOP_DURATION = 850;                       // 单列停止动画时长(ms)
const STOP_DELAYS = [1100, 1900, 2700];          // 三列依次停止延迟
const MAX_DT = 32;                               // 单帧最大时间(ms)，防止卡顿大跳

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type ReelRuntime = {
  state: 'idle' | 'spinning' | 'stopping' | 'stopped';
  offset: number;       // 当前 translateY(px)
  target: number;       // 停止目标 offset
  stopStart: number;    // stopping 开始时间戳
  startOffset: number;  // stopping 开始时的 offset
  targetIndex: number;  // 目标食物在 FOODS 中的索引
};

type SpinResult = {
  names: [string, string, string];
  jackpot: boolean;
};

/* ============================================
   动画
   ============================================ */
const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const resultBounce = keyframes`
  0%   { opacity: 0; transform: scale(0.6) translateY(12px); }
  55%  { opacity: 1; transform: scale(1.1) translateY(0); }
  72%  { transform: scale(0.95); }
  88%  { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

const jackpotShine = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const iconFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-2px) rotate(-6deg); }
`;

const spinRotate = keyframes`
  to { transform: rotate(360deg); }
`;

/* ============================================
   统一卡片样式
   ============================================ */
const MachineWrapper = styled.div`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  box-shadow: ${theme.card.shadow};
  position: relative;
  overflow: hidden;
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.card.shadowHover};
  }
`;

/* 入场动画单独一层，避免与 hover transform 冲突 */
const MachineEnter = styled.div`
  padding: ${theme.card.padding};
  animation: ${cardEnter} 0.6s 0.15s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
`;

const MachineHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  padding-left: 4px;
`;

const MachineIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
    animation: ${iconFloat} 3s ease-in-out infinite;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const MachineTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.3px;
`;

const MachineSubtitle = styled.span`
  font-size: 12px;
  color: ${theme.colors.textTertiary};
  font-weight: 400;
`;

/* 老虎机窗口 */
const SlotWindow = styled.div`
  position: relative;
  display: flex;
  gap: 6px;
  padding: 10px;
  border-radius: ${theme.borderRadius.md};
  background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.4),
    0 4px 16px rgba(249, 115, 22, 0.08);
  overflow: hidden;
`;

const ReelColumn = styled.div`
  flex: 1;
  position: relative;
  height: ${ITEM_HEIGHT * VISIBLE}px;
  overflow: hidden;
  border-radius: ${theme.borderRadius.sm};
  background: rgba(0, 0, 0, 0.25);
`;

const Reel = styled.div`
  will-change: transform;
`;

const FoodItem = styled.div`
  height: ${ITEM_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

/* 中间高亮线 */
const CenterLine = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  top: ${ITEM_HEIGHT + 10}px;
  height: ${ITEM_HEIGHT}px;
  border-top: 2px solid rgba(249, 115, 22, 0.6);
  border-bottom: 2px solid rgba(249, 115, 22, 0.6);
  pointer-events: none;
  box-shadow: 0 0 18px rgba(249, 115, 22, 0.18) inset;
`;

/* 上下渐变遮罩，营造虚化效果 */
const Fade = styled.div<{ pos: 'top' | 'bottom' }>`
  position: absolute;
  left: 10px;
  right: 10px;
  height: ${ITEM_HEIGHT}px;
  pointer-events: none;
  z-index: 2;
  ${({ pos }) =>
    pos === 'top'
      ? `top: 10px; background: linear-gradient(to bottom, rgba(17,24,39,0.95), transparent);`
      : `bottom: 10px; background: linear-gradient(to top, rgba(17,24,39,0.95), transparent);`}
`;

/* 按钮 */
const SpinButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  margin-top: ${theme.spacing.md};
  padding: 13px 20px;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 18px rgba(249, 115, 22, 0.32);
  transition: ${theme.transitions.default};

  svg {
    width: 17px;
    height: 17px;
    stroke-width: 2.4;
  }

  & .spin-icon {
    animation: ${spinRotate} 0.8s linear infinite;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.08);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(249, 115, 22, 0.42);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.75;
    filter: saturate(0.7);
  }
`;

/* 结果区 */
const ResultBox = styled.div<{ jackpot: boolean }>`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  position: relative;
  overflow: hidden;
  background: ${({ jackpot }) =>
    jackpot
      ? 'linear-gradient(100deg, #FFF7ED 0%, #FFE4D6 25%, #FFEDD5 50%, #FFE4D6 75%, #FFF7ED 100%)'
      : theme.colors.bgTertiary};
  background-size: ${({ jackpot }) => (jackpot ? '200% 100%' : '100% 100%')};
  animation: ${({ jackpot }) =>
    jackpot
      ? `${resultBounce} 0.7s cubic-bezier(0.25, 1.2, 0.5, 1) both, ${jackpotShine} 2s linear infinite`
      : `${resultBounce} 0.7s cubic-bezier(0.25, 1.2, 0.5, 1) both`};
`;

const ResultLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.textTertiary};
  letter-spacing: 2px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  svg {
    width: 13px;
    height: 13px;
    color: ${theme.colors.accentOrange};
  }
`;

const ResultFood = styled.div<{ jackpot: boolean }>`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 1px;
  background: ${({ jackpot }) =>
    jackpot
      ? 'linear-gradient(90deg, #F97316, #EF4444, #F97316)'
      : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'};
  background-size: ${({ jackpot }) => (jackpot ? '200% 100%' : '100% 100%')};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  ${({ jackpot }) => (jackpot ? `animation: ${jackpotShine} 2s linear infinite;` : '')}
`;

const ResultAlts = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: ${theme.colors.textTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  span {
    font-weight: 600;
    color: ${theme.colors.textSecondary};
  }
`;

const Hint = styled.div`
  margin-top: ${theme.spacing.sm};
  text-align: center;
  font-size: 12px;
  color: ${theme.colors.textTertiary};
`;

/* 响应式容器 */
const ResponsiveWrap = styled.div`
  @media (max-width: 640px) {
    ${MachineTitle} { font-size: 15px; }
    ${FoodItem} { font-size: 15px; }
    ${ResultFood} { font-size: 22px; }
    ${MachineEnter} { padding: ${theme.spacing.md}; }
  }
`;

/* ============================================
   组件
   ============================================ */
export default function FoodSlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [spinCount, setSpinCount] = useState(0);

  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reelData = useRef<ReelRuntime[]>(
    [0, 1, 2].map((i) => ({
      state: 'idle',
      offset: (1 - ((i * 7) % FOODS.length)) * ITEM_HEIGHT,
      target: 0,
      stopStart: 0,
      startOffset: 0,
      targetIndex: (i * 7) % FOODS.length,
    })) as ReelRuntime[]
  );
  const rafRef = useRef<number | null>(null);
  const lastNowRef = useRef<number>(0);
  const spinningFlowRef = useRef<boolean>(false);
  const timersRef = useRef<number[]>([]);

  /* reel 渲染内容：FOODS 重复 REPEATS 圈，保证无缝滚动 */
  const reelItems = useMemo(() => {
    const arr: string[] = [];
    for (let r = 0; r < REPEATS; r++) {
      for (let i = 0; i < FOODS.length; i++) arr.push(FOODS[i]);
    }
    return arr;
  }, []);

  /* 停止某一列：计算目标 offset 并进入 stopping 状态 */
  const stopReel = useCallback((idx: number) => {
    const r = reelData.current[idx];
    if (r.state !== 'spinning') return;
    r.state = 'stopping';
    r.stopStart = performance.now();
    r.startOffset = r.offset;
    // 目标基础 offset：让 targetIndex 这一项对齐窗口中间槽
    const base = (1 - r.targetIndex) * ITEM_HEIGHT;
    let target = base;
    // 让 target 沿继续向上方向落在 (offset - SINGLE, offset] 内
    while (target > r.offset) target -= SINGLE;
    // 保证减速距离至少 0.4 圈，停止过程更自然
    while (r.offset - target < SINGLE * 0.4) target -= SINGLE;
    r.target = target;
  }, []);

  /* 开吃 */
  const spin = useCallback(() => {
    if (spinningFlowRef.current) return;
    setSpinning(true);
    setResult(null);
    spinningFlowRef.current = true;

    const reels = reelData.current;
    for (let i = 0; i < 3; i++) {
      // 归一化 offset 到 [-SINGLE, 0]
      let off = reels[i].offset;
      while (off <= -SINGLE) off += SINGLE;
      while (off > 0) off -= SINGLE;
      reels[i].offset = off;
      reels[i].targetIndex = Math.floor(Math.random() * FOODS.length);
      reels[i].state = 'spinning';
    }

    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = STOP_DELAYS.map((d, i) =>
      window.setTimeout(() => stopReel(i), d)
    );
  }, [stopReel]);

  /* rAF 主循环 */
  const tick = useCallback((now: number) => {
    const dt = Math.min(now - lastNowRef.current, MAX_DT);
    lastNowRef.current = now;
    const reels = reelData.current;

    for (let i = 0; i < 3; i++) {
      const r = reels[i];
      if (r.state === 'spinning') {
        r.offset -= SPIN_SPEED * dt;
        while (r.offset <= -SINGLE) r.offset += SINGLE;
      } else if (r.state === 'stopping') {
        const elapsed = now - r.stopStart;
        const t = Math.min(elapsed / STOP_DURATION, 1);
        const e = easeOutCubic(t);
        r.offset = r.startOffset + (r.target - r.startOffset) * e;
        if (t >= 1) {
          r.offset = r.target;
          r.state = 'stopped';
        }
      }
      const el = reelRefs.current[i];
      if (el) el.style.transform = `translate3d(0, ${r.offset}px, 0)`;
    }

    // 全部停止 -> 生成结果
    if (spinningFlowRef.current && reels.every((r) => r.state === 'stopped')) {
      spinningFlowRef.current = false;
      setSpinning(false);
      const names = reels.map((r) => FOODS[r.targetIndex]) as [string, string, string];
      setResult({
        names,
        jackpot: names[0] === names[1] && names[1] === names[2],
      });
      setSpinCount((c) => c + 1);
    }
  }, []);

  /* 启动 rAF 循环 */
  useEffect(() => {
    lastNowRef.current = performance.now();
    const loop = (now: number) => {
      tick(now);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, [tick]);

  return (
    <ResponsiveWrap>
      <MachineWrapper>
        <MachineEnter>
          <MachineHeader>
            <MachineIcon>
              <UtensilsCrossed />
            </MachineIcon>
            <TitleGroup>
              <MachineTitle>今天吃什么</MachineTitle>
              <MachineSubtitle>转一转，帮你做决定</MachineSubtitle>
            </TitleGroup>
          </MachineHeader>

          <SlotWindow>
            {[0, 1, 2].map((col) => (
              <ReelColumn key={col}>
                <Reel
                  ref={(el) => {
                    reelRefs.current[col] = el;
                  }}
                >
                  {reelItems.map((f, idx) => (
                    <FoodItem key={idx}>{f}</FoodItem>
                  ))}
                </Reel>
              </ReelColumn>
            ))}
            <CenterLine />
            <Fade pos="top" />
            <Fade pos="bottom" />
          </SlotWindow>

          <SpinButton disabled={spinning} onClick={spin}>
            {spinning ? (
              <>
                <RefreshCw className="spin-icon" /> 决定中...
              </>
            ) : (
              <>
                <UtensilsCrossed /> {result ? '再来一次' : '开吃'}
              </>
            )}
          </SpinButton>

          {result ? (
            <ResultBox key={spinCount} jackpot={result.jackpot}>
              <ResultLabel>
                <Sparkles /> {result.jackpot ? '三连一致 · 今日大奖' : '今日推荐'}
              </ResultLabel>
              <ResultFood jackpot={result.jackpot}>{result.names[1]}</ResultFood>
              {!result.jackpot && (
                <ResultAlts>
                  备选 · <span>{result.names[0]}</span> · <span>{result.names[2]}</span>
                </ResultAlts>
              )}
            </ResultBox>
          ) : (
            <Hint>点击「开吃」开始滚动，三列依次停下揭晓答案</Hint>
          )}
        </MachineEnter>
      </MachineWrapper>
    </ResponsiveWrap>
  );
}
