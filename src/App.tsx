/**
 * App 主组件
 * 直接进入主页，登录通过导航栏头像点击触发
 * 所有页面共享同一 Layout（关于页面自动全宽，其余双栏含右侧栏）
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
