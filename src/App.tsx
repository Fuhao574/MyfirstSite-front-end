/**
 * App 主组件
 * 路由结构：WelcomePage → 主页路由
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import WelcomePage from './components/WelcomePage';
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
  const [entered, setEntered] = useState(() => sessionStorage.getItem('entered') === 'true');

  const handleEnter = () => {
    sessionStorage.setItem('entered', 'true');
    setEntered(true);
  };

  if (!entered) {
    return (
      <AppContainer>
        <WelcomePage onEnter={handleEnter} />
      </AppContainer>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;