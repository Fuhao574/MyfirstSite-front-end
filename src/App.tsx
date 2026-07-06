/**
 * App 主组件
 * 单页结构：Navbar + Hero（全部内容在一页）
 */

import styled from '@emotion/styled';
import { theme } from './styles/theme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bgPrimary};
`;

export default function App() {
  return (
    <AppContainer>
      <Navbar />
      <Hero />
    </AppContainer>
  );
}