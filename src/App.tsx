/**
 * App 主组件
 * 直接进入主页，登录通过导航栏头像点击触发
 * 主页/博客/项目/归档/友链使用共享双栏布局（含右侧栏）
 * 关于页面使用简单布局（全宽，无右侧栏）
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Layout from './components/Layout';
import SimpleLayout from './components/SimpleLayout';
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
  return (
    <AppContainer>
      <BrowserRouter>
        <Routes>
          {/* 共享双栏布局（含右侧栏） */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/friends" element={<Friends />} />
          </Route>
          {/* 简单布局（全宽，无右侧栏） */}
          <Route element={<SimpleLayout />}>
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/home" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppContainer>
  );
}

export default App;
