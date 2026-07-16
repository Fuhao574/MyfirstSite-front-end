/**
 * App 主组件
 * 直接进入主页，登录通过导航栏头像点击触发
 * 所有页面共享同一 Layout（关于页面自动全宽，其余双栏含右侧栏）
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import Archive from './pages/Archive';
import Friends from './pages/Friends';
import About from './pages/About';

const AppContainer = styled.div`
  min-height: 100vh;
`;

function App() {
  // 全局禁止所有 input/textarea 输入空格
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === ' ' &&
        (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return;
      const pastedText = e.clipboardData?.getData('text') || '';
      if (/\s/.test(pastedText)) {
        e.preventDefault();
        const cleaned = pastedText.replace(/\s/g, '');
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        const newValue = target.value.slice(0, start) + cleaned + target.value.slice(end);
        const setter = Object.getOwnPropertyDescriptor(
          target instanceof HTMLTextAreaElement
            ? window.HTMLTextAreaElement.prototype
            : window.HTMLInputElement.prototype,
          'value'
        )?.set;
        setter?.call(target, newValue);
        target.dispatchEvent(new Event('input', { bubbles: true }));
        const cursorPos = start + cleaned.length;
        target.setSelectionRange(cursorPos, cursorPos);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('paste', handlePaste);
    };
  }, []);
  return (
    <AppContainer>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<Blog />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContainer>
  );
}

export default App;
