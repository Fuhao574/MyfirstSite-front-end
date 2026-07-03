/**
 * App 主组件
 * 组装所有模块，统一管理页面结构
 */

import styled from '@emotion/styled';
import { theme } from './styles/theme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Footer from './components/Footer';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bgPrimary};
`;

const Divider = styled.div`
  height: 1px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 0, 0, 0.06) 50%,
    transparent 100%
  );
`;

export default function App() {
  return (
    <AppContainer>
      <Navbar />
      <Hero />
      <Divider />
      <Skills />
      <Footer />
    </AppContainer>
  );
}
